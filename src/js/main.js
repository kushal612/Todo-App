// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap’s JS
import * as bootstrap from "bootstrap";

let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

renderTodo();

function addTodo() {
  const nameInput = document.querySelector(".js-name-input");
  const name = nameInput.value;
  const dueDateInput = document.querySelector(".js-due-date-input");
  const dueDate = dueDateInput.value;
  todoList.push({
    name,
    dueDate,
  });
  localStorage.setItem("todoList", JSON.stringify(todoList));
  nameInput.value = "";
  renderTodo();
}

function renderTodo() {
  let todo = "";
  todoList.forEach(function (todoObj) {
    const { name, dueDate } = todoObj;
    const todoHTML = `
    <div class ="container">
    <div class="row row-cols-2">
        <div class="name-todo col-7" >${name}
        
        <button 
        class="delete-todo-button col-5"
        ">Delete</button>
        </div>
        <div class="due-date-todo " > ${dueDate} </div>
        
      </div>
      </div>
        `;
    todo += todoHTML;
  });
  document.querySelector(".js-todo-list").innerHTML = todo;

  document
    .querySelectorAll(".delete-todo-button")
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener("click", () => {
        todoList.splice(index, 1);
        localStorage.setItem("todoList", JSON.stringify(todoList));
        renderTodo();
      });
    });
}

document.querySelector(".add-todo-button").addEventListener("click", () => {
  addTodo();
  const addButton = document.querySelector(".add-todo-button");
  addButton.innerText = "Added";
  setTimeout(() => {
    addButton.innerText = "Add";
  }, 1000);
});
