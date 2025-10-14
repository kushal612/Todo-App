import { updateTask } from "./api.js";
import * as bootstrap from "bootstrap";
import { formatDate, getImportanceBadge } from "./utils.js";

let tasks = [];
let currentFilter = "all";
let currentPriorityFilter = "all";
let taskIdToEdit = null;

const tasksList = document.getElementById("tasksList");
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editTaskInput = document.getElementById("editTaskInput");
const editImportanceSelect = document.getElementById("editImportanceSelect");
const editTagsInput = document.getElementById("editTagsInput");

export function getTasksState() {
  return tasks;
}
export function getCurrentFilter() {
  return currentFilter;
}
export function getCurrentPriorityFilter() {
  return currentPriorityFilter;
}
export function getTaskIdToEdit() {
  return taskIdToEdit;
}

export function setCurrentFilter(value) {
  currentFilter = value;
}
export function setCurrentPriorityFilter(value) {
  currentPriorityFilter = value;
}
export function setTaskIdToEdit(value) {
  taskIdToEdit = value;
}

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

export function renderTasks(newTasks) {
  tasks = newTasks;
  tasksList.innerHTML = "";

  if (!tasks.length) {
    tasksList.innerHTML = `<div class="text-center text-muted py-3">No tasks found</div>`;
    return;
  }

  tasks.forEach((t) => {
    const el = document.createElement("div");
    el.className = `task-item list-group-item d-flex align-items-start ${
      t.isCompleted ? "completed" : ""
    }`;

    el.innerHTML = `
      <div class="form-check me-3">
        <input type="checkbox" class="form-check-input mt-2" ${
          t.isCompleted ? "checked" : ""
        }>
      </div>
      <div class="task-content flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <div class="task-text ${
            t.isCompleted
              ? "text-decoration-line-through text-muted"
              : "fw-bold"
          }">${t.title}</div>
          <div class="btn-group btn-group-sm d-flex flex-row gap-2">
            <button class="btn btn-outline-primary btn-edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger btn-delete"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        <div class="meta-info small text-muted mt-1">
          <div class="d-flex flex-wrap">
            <span class="me-3">${getImportanceBadge(t.isImportant)}</span>
            ${
              t.tags?.length
                ? t.tags
                    .map(
                      (tag) =>
                        `<span class="badge bg-info text-dark me-1">#${tag}</span>`
                    )
                    .join("")
                : ""
            }
          </div>
          <div class="mt-1">
            <span class="me-3">Created: ${formatDate(t.createdAt)}</span>
            ${
              t.createdAt !== t.updatedAt
                ? `<br><span>Updated: ${formatDate(t.updatedAt)}</span>`
                : ""
            }
          </div>
        </div>
      </div>
    `;

    el.querySelector("input").addEventListener("change", async (e) => {
      await updateTask(t._id, { isCompleted: e.target.checked });
      t.isCompleted = e.target.checked;
      renderTasks(tasks);
    });

    el.querySelector(".btn-edit").addEventListener("click", () => {
      setTaskIdToEdit(t._id);
      editTaskInput.value = t.title;
      editImportanceSelect.value = t.isImportant ? "important" : "normal";
      editTagsInput.value = t.tags?.join(", ") || "";
      editModal.show();
    });

    el.querySelector(".btn-delete").addEventListener("click", () => {
      const deleteEvent = new CustomEvent("deleteTask", { detail: t._id });
      document.dispatchEvent(deleteEvent);
    });

    tasksList.appendChild(el);
  });
}
