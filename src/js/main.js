// // Import our custom CSS
// import "../scss/styles.scss";

// //Import Bootstrap JS
// import * as bootstrap from "bootstrap";

// const API_URL = "http://localhost:3000/api/tasks";

// let tasks = [];

// const inputTask = document.getElementById("inputTask");
// const tasksList = document.getElementById("tasksList");
// const addBtn = document.getElementById("addBtn");
// const imp = document.getElementById("impOrder");
// const tag = document.getElementById("tagInput");
// const filters = document.getElementById("filters");
// const searchInput = document.getElementById("searchInput");
// const clearCompleted = document.getElementById("clearCompleted");
// const clearAll = document.getElementById("clearAll");

// const editModal = new bootstrap.Modal(document.getElementById("editModal"));
// const editTaskInput = document.getElementById("editTaskInput");
// const editImportanceSelect = document.getElementById("editImportanceSelect");
// const editTagsInput = document.getElementById("editTagsInput");
// const saveEditBtn = document.getElementById("saveEditBtn");

// const clearAllModal = new bootstrap.Modal(
//   document.getElementById("clearAllModal")
// );
// const confirmClearAllBtn = document.getElementById("confirmClearAllBtn");

// const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
// const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// let taskIdToEdit = null;
// let taskIdToDelete = null;
// let currentFilter = "all";
// let currentPriorityFilter = "all";

// async function loadTasks() {
//   try {
//     const params = new URLSearchParams({
//       filter: currentFilter,
//       priority: currentPriorityFilter,
//       search: searchInput.value.trim(),
//     });

//     const res = await fetch(`${API_URL}?${params.toString()}`);
//     tasks = await res.json();

//     renderTasks();
//   } catch (err) {
//     console.error("Error loading tasks:", err);
//   }
// }

// async function addTask(text, importance, tags) {
//   if (!text.trim()) return;

//   const tagsArray = tags
//     ? tags
//         .split(/[\s,]+/)
//         .filter((tag) => tag.trim() !== "")
//         .map((tag) => tag.trim().toLowerCase())
//     : [];

//   try {
//     await fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: text.trim(),
//         isImportant: importance === "important",
//         tags: tagsArray,
//       }),
//     });
//     loadTasks();
//   } catch (err) {
//     console.error("Error adding task:", err);
//   }
// }

// export async function saveEditedTask() {
//   if (!taskIdToEdit) return;

//   const updatedData = {
//     title: editTaskInput.value.trim(),
//     isImportant: editImportanceSelect.value === "important",
//     tags: editTagsInput.value
//       ? editTagsInput.value
//           .split(/[\s,]+/)
//           .filter((tag) => tag.trim() !== "")
//           .map((tag) => tag.trim().toLowerCase())
//       : [],
//   };

//   try {
//     await fetch(`${API_URL}/${taskIdToEdit}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updatedData),
//     });
//     editModal.hide();
//     taskIdToEdit = null;
//     loadTasks();
//   } catch (err) {
//     console.error("Error updating task:", err);
//   }
// }

// export async function deleteTask(id) {
//   try {
//     await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//     loadTasks();
//   } catch (err) {
//     console.error("Error deleting task:", err);
//   }
// }

// export async function clearCompletedTasks() {
//   try {
//     await fetch(`${API_URL}/clear/completed`, { method: "DELETE" });
//     loadTasks();
//   } catch (err) {
//     console.error("Error clearing completed tasks:", err);
//   }
// }

// export async function clearAllTasks() {
//   try {
//     await fetch(`${API_URL}/clear/all`, { method: "DELETE" });
//     loadTasks();
//   } catch (err) {
//     console.error("Error clearing all tasks:", err);
//   }
// }

// async function toggleDone(id, done) {
//   try {
//     await fetch(`${API_URL}/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ isCompleted: done }),
//     });
//     loadTasks();
//   } catch (err) {
//     console.error("Error toggling task:", err);
//   }
// }

// function formatDate(dateString) {
//   const date = new Date(dateString);
//   return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   })}`;
// }

// function getImportanceBadge(isImportant) {
//   return `<span class="badge bg-${isImportant ? "danger" : "secondary"}">${
//     isImportant ? "important" : "normal"
//   }</span>`;
// }

// function renderTasks() {
//   tasksList.innerHTML = "";
//   if (!tasks.length) {
//     tasksList.innerHTML =
//       '<div class="text-center text-muted py-3">No tasks found</div>';
//     return;
//   }

//   tasks.forEach((t) => {
//     const el = document.createElement("div");
//     el.className = `task-item list-group-item d-flex align-items-start ${
//       t.isCompleted ? "completed" : ""
//     }`;
//     el.innerHTML = `
//       <div class="form-check me-3">
//         <input type="checkbox" class="form-check-input mt-2" ${
//           t.isCompleted ? "checked" : ""
//         }>
//       </div>
//       <div class="task-content flex-grow-1">
//         <div class="d-flex justify-content-between align-items-start">
//           <div class="task-text ${
//             t.isCompleted
//               ? "text-decoration-line-through text-muted"
//               : "fw-bold"
//           }">${t.title}</div>
//           <div class="btn-group btn-group-sm d-flex flex-row gap-2 flex-shrink-0">
//             <button class="btn btn-outline-primary btn-edit" title="Edit Task"><i class="bi bi-pencil"></i></button>
//             <button class="btn btn-outline-danger btn-delete" title="Delete Task"><i class="bi bi-trash"></i></button>
//           </div>
//         </div>
//         <div class="meta-info small text-muted mt-1">
//           <div class="d-flex align-items-center flex-wrap">
//             <span class="me-3">${getImportanceBadge(t.isImportant)}</span>
//             ${
//               t.tags?.length
//                 ? t.tags
//                     .map(
//                       (tag) =>
//                         `<span class="badge bg-info text-dark me-1">#${tag}</span>`
//                     )
//                     .join("")
//                 : ""
//             }
//           </div>
//           <div class="mt-1">
//             <span class="me-3">Created: ${formatDate(t.createdAt)}</span><br>
//             ${
//               t.createdAt !== t.updatedAt
//                 ? `<span class="me-3">Updated: ${formatDate(
//                     t.updatedAt
//                   )}</span>`
//                 : ""
//             }
//           </div>
//         </div>
//       </div>
//     `;

//     el.querySelector("input").addEventListener("change", (e) =>
//       toggleDone(t._id, e.target.checked)
//     );
//     el.querySelector(".btn-edit").addEventListener("click", () => {
//       taskIdToEdit = t._id;
//       editTaskInput.value = t.title;
//       editImportanceSelect.value = t.isImportant ? "important" : "normal";
//       editTagsInput.value = t.tags?.join(", ") || "";
//       editModal.show();
//     });
//     el.querySelector(".btn-delete").addEventListener("click", () => {
//       taskIdToDelete = t._id;
//       deleteModal.show();
//     });

//     tasksList.appendChild(el);
//   });
// }

// addBtn.addEventListener("click", () => {
//   addTask(inputTask.value, imp.value, tag.value);
//   inputTask.value = "";
//   tag.value = "";
// });

// inputTask.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") addBtn.click();
// });
// tag.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") addBtn.click();
// });
// imp.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") addBtn.click();
// });

// filters.addEventListener("click", (e) => {
//   if (e.target.closest("button")) {
//     currentFilter = e.target.closest("button").dataset.filter;
//     document
//       .querySelectorAll("#filters button")
//       .forEach((btn) =>
//         btn.classList.toggle("active", btn.dataset.filter === currentFilter)
//       );
//     loadTasks();
//     renderTasks();
//   }
// });

// searchInput.addEventListener("input", loadTasks);

// document.querySelectorAll(".priority").forEach((button) => {
//   button.addEventListener("click", (e) => {
//     currentPriorityFilter = e.target.dataset.filter;
//     document
//       .querySelectorAll(".priority")
//       .forEach((btn) => btn.classList.remove("active"));
//     e.target.classList.add("active");
//     loadTasks();
//   });
// });

// clearCompleted.addEventListener("click", clearCompletedTasks);

// clearAll.addEventListener("click", () => clearAllModal.show());
// confirmClearAllBtn.addEventListener("click", () => {
//   clearAllTasks();
//   clearAllModal.hide();
// });
// saveEditBtn.addEventListener("click", saveEditedTask);
// confirmDeleteBtn.addEventListener("click", () => {
//   if (taskIdToDelete) {
//     deleteTask(taskIdToDelete);
//     taskIdToDelete = null;
//     deleteModal.hide();
//   }
//   loadTasks();
// });

// loadTasks();

// // // Import Custom CSS
// // import "../scss/styles.scss";

// // // Import Bootstrap JS
// // //import * as bootstrap from "bootstrap";

// // import { getTasks } from "./api.js";
// // import { renderTasks, currentFilter, currentPriorityFilter } from "./dom.js";
// // import "./events.js";
// // import "./modal.js";

// // export async function loadTasks() {
// //   try {
// //     const tasks = await getTasks({
// //       filter: currentFilter,
// //       priority: currentPriorityFilter,
// //       search: document.getElementById("searchInput").value.trim(),
// //     });
// //     renderTasks(tasks);
// //   } catch (err) {
// //     console.error("Error loading tasks:", err);
// //   }
// // }

// // loadTasks();

import '../scss/styles.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import { loadTasks } from './events.js';

const access_token = localStorage.getItem('access_token');

if (!access_token) {
  window.location.href = '../pages/login.html';
}

loadTasks();
