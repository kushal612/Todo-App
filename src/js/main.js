// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap’s JS
import * as bootstrap from "bootstrap";

let tasks = [];
let currentFilter = "all";

const inputTask = document.getElementById("inputTask");
const addBtn = document.getElementById("addBtn");
const tasksList = document.getElementById("tasksList");

const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const clearCompleted = document.getElementById("clearCompleted");
const clearAll = document.getElementById("clearAll");

function uId() {
  return crypto.randomUUID();
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("task")) || [];
}

function saveTask() {
  localStorage.setItem("task", JSON.stringify(tasks));
}

function addTask(text) {
  if (!text.trim()) {
    return;
  }
  tasks.push({ id: uId(), text: text.trim(), done: false });
  saveTask();
  renderTask();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTask();
  renderTask();
}

function toggleDone(id) {
  const t = tasks.find((x) => x.id === id);
  if (t) {
    t.done = !t.done;
    saveTask();
    renderTask();
  }
}

function editTask(id) {
  const newText = prompt("Edit task:", tasks.find((t) => t.id === id).text);
  if (newText) {
    tasks.find((t) => t.id === id).text = newText.trim();
    saveTask();
    renderTask();
  }
}

function clearCompletedTasks() {
  tasks = tasks.filter((t) => !t.done);
  saveTask();
  renderTask();
}
function clearAllTask() {
  tasks = [];
  saveTask();
  renderTask();
}

function applyFilter(flt) {
  currentFilter = flt;
  Array.from(filters.querySelectorAll("button")).forEach((b) =>
    b.classList.toggle("current", b.dataset.filter === flt)
  );
  renderTask();
}

function renderTask() {
  const q = searchInput.value.toLowerCase();
  let visible = tasks.filter((t) => {
    if (currentFilter === "current" && t.done) return false;
    if (currentFilter === "completed" && !t.done) return false;
    if (q && !t.text.toLowerCase().includes(q)) return false;
    return true;
  });
  tasksList.innerHTML = "";
  if (visible.length === 0) {
    tasksList.innerHTML =
      '<div class="text-center text-muted py-3">No tasks found</div>';
  } else {
    visible.forEach((t) => {
      const el = document.createElement("div");
      el.className = "task-item" + (t.done ? " completed" : "");
      el.innerHTML = `
              <div class="form-check">
                <input type="checkbox" class="form-check-input" ${
                  t.done ? "checked" : ""
                }>
              </div>
              <div class="task-text">${t.text}</div>
              <div class="btn-group btn-group-sm d-flex gap-2">
                <button class="btn btn-outline-primary"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger"><i class="bi bi-trash"></i></button>
              </div>
              
              <div id="id01" class="modal d-flex-">
                  <span onclick="document.getElementById('id01').style.display='none'" class="close" title="Close Modal">&times;</span>
                      <form class="modal-content" action="/action_page.php">
                          <div class="container">
                                <h1>Delete Task</h1>
                                <p>Are you sure you want to delete this task?</p>
                                <div class="d-flex flex-row justify-content-center align-items-center gap-2">
                                  <div>
                                    <button type="button" class="cancel-btn border-0 p-3" onclick="document.getElementById('id01').style.display='none'">Cancel</button>
                                  </div>
                                  <div>
                                    <button type="button" class="delete-btn border-0 p-3">Delete</button>
                                  </div>
                                </div>
                          </div>
                       </form>
                </div>
              `;
      el.querySelector("input").addEventListener("change", () =>
        toggleDone(t.id)
      );
      el.querySelector(".bi-pencil").parentElement.addEventListener(
        "click",
        () => editTask(t.id)
      );
      el.querySelector(".bi-trash").parentElement.addEventListener(
        "click",
        () => {
          document.getElementById("id01").style.display = "block";
        }
      );
      el.querySelector(".delete-btn").parentElement.addEventListener(
        "click",
        () => {
          deleteTask(t.id);
        }
      );
      tasksList.appendChild(el);
    });
  }
  const remaining = tasks.filter((t) => !t.done).length;
  remainingCount.innerText = remaining + " remaining";
}

addBtn.addEventListener("click", () => {
  addTask(inputTask.value);
  inputTask.value = "";
});
inputTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(inputTask.value);
    inputTask.value = "";
  }
});
filters.addEventListener("click", (e) => {
  if (e.target.closest("button"))
    applyFilter(e.target.closest("button").dataset.filter);
});
searchInput.addEventListener("input", renderTask);
clearCompleted.addEventListener("click", clearCompletedTasks);
clearAll.addEventListener("click", () => {
  document.getElementById("id01").style.display = "block";
  document.querySelector(".delete-btn").addEventListener("click", () => {
    clearAllTask();
  });
});

loadTasks();
renderTask();
