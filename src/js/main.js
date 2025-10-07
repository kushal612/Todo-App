// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap’s JS
import * as bootstrap from "bootstrap";

const API_URL = "http://localhost:3000/todos";

let tasks = [];
let currentFilter = "all";

const inputTask = document.getElementById("inputTask");
const addBtn = document.getElementById("addBtn");
const tasksList = document.getElementById("tasksList");
const imp = document.getElementById("impOrder");
const tag = document.getElementById("tagInput");

const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const clearCompleted = document.getElementById("clearCompleted");
const clearAll = document.getElementById("clearAll");
const remainingCount = document.getElementById("remainingCount");

const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editTaskInput = document.getElementById("editTaskInput");
const editImportanceSelect = document.getElementById("editImportanceSelect");
const editTagsInput = document.getElementById("editTagsInput");
const saveEditBtn = document.getElementById("saveEditBtn");

const clearAllModal = new bootstrap.Modal(
  document.getElementById("clearAllModal")
);
const confirmClearAllBtn = document.getElementById("confirmClearAllBtn");

const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let taskIdToEdit = null;
let taskIdToDelete = null;

async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok)
      throw new Error(`Server error: ${res.status} ${res.statusText}`);

    const todos = await res.json();

    tasks = todos.map((t) => ({
      id: t.id,
      text: t.title,
      done: t.isCompleted,
      importance: t.isImpotant || "Normal",
      tags: Array.isArray(t.tags)
        ? t.tags
        : t.tags
        ? t.tags.split(/[\s,]+/).map((tag) => tag.trim().toLowerCase())
        : [],
      createdOn: t.createdAt,
      updatedOn: t.updatedAt,
    }));
    renderTask();
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const dateOptions = { month: "short", day: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  return `${date.toLocaleDateString(
    undefined,
    dateOptions
  )} at ${date.toLocaleTimeString(undefined, timeOptions)}`;
}

async function addTask(text, importance, tags) {
  if (typeof text !== "string") {
    return false;
  }
  if (!text.trim()) {
    return;
  }

  const now = new Date().toISOString();
  const newTask = {
    title: text.trim(),
    isCompleted: false,
    isImpotant: importance || "Normal",
    tags: tags
      .split(/[\s,]+/)
      .filter((tag) => tag.trim() !== "")
      .map((tag) => tag.trim().toLowerCase())
      .join(","),
    createdAt: now,
    updatedAt: now,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    const savedTask = await res.json();

    tasks.push({
      id: savedTask.id,
      text: savedTask.title,
      done: savedTask.isCompleted,
      importance: savedTask.isImpotant,
      tags: savedTask.tags
        ? savedTask.tags.split(/[\s,]+/).map((t) => t.trim().toLowerCase())
        : [],
      createdOn: savedTask.createdAt,
      updatedOn: savedTask.updatedAt,
    });

    renderTask();
  } catch (err) {
    console.error("Error adding task:", err);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    tasks = tasks.filter((t) => t.id !== id);
    renderTask();
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

async function toggleDone(id) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return;

  t.done = !t.done;
  t.updatedOn = new Date().toISOString();

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: t.done, updatedAt: t.updatedOn }),
    });
    renderTask();
  } catch (err) {
    console.error("Error toggling task:", err);
  }
}

function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  taskIdToEdit = id;
  editTaskInput.value = task.text;
  editImportanceSelect.value = task.importance;
  editTagsInput.value = task.tags.join(", ");
  editModal.show();
}

async function saveEditedTask() {
  const id = taskIdToEdit;
  if (!id) return;

  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const newText = editTaskInput.value.trim();
  const newImportance = editImportanceSelect.value;
  const newTags = editTagsInput.value;

  if (newText) {
    task.text = newText;
    task.importance = newImportance;
    task.tags = newTags
      .split(/[\s,]+/)
      .filter((tag) => tag.trim() !== "")
      .map((tag) => tag.trim().toLowerCase());
    task.updatedOn = new Date().toISOString();

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.text,
          isImpotant: task.importance,
          tags: task.tags.join(","),
          updatedAt: task.updatedOn,
        }),
      });
      renderTask();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  }

  editModal.hide();
  taskIdToEdit = null;
}

async function clearCompletedTasks() {
  const completedTasks = tasks.filter((t) => t.done);
  for (const t of completedTasks) {
    await deleteTask(t.id);
  }
}

async function clearAllTask() {
  for (const t of tasks) {
    await deleteTask(t.id);
  }
}

function applyFilter(flt) {
  currentFilter = flt;
  Array.from(filters.querySelectorAll("button")).forEach((b) =>
    b.classList.toggle("active", b.dataset.filter === flt)
  );
  renderTask();
}

function getImportanceBadge(importance) {
  let color = "secondary";
  switch (importance.toLowerCase()) {
    case "low":
      color = "danger";
      break;
    case "medium":
      color = "warning";
      break;
    case "high":
      color = "success";
      break;
  }
  return `<span class="badge bg-${color} text-uppercase">${importance}</span>`;
}

function renderTask() {
  const q = searchInput.value.toLowerCase();
  let visible = tasks.filter((t) => {
    if (currentFilter === "current" && t.done) return false;
    if (currentFilter === "completed" && !t.done) return false;

    if (
      q &&
      !t.text.toLowerCase().includes(q) &&
      !t.tags.some((tag) => tag.includes(q))
    )
      return false;

    return true;
  });

  visible.sort((a, b) => {
    const importanceOrder = { high: 3, medium: 2, low: 1 };
    const aImp = a.importance ? a.importance.toLowerCase() : "";
    const bImp = b.importance ? b.importance.toLowerCase() : "";
    const diff = importanceOrder[bImp] - importanceOrder[aImp];
    if (diff !== 0) return diff;
    return new Date(b.createdOn) - new Date(a.createdOn);
  });

  tasksList.innerHTML = "";
  if (visible.length === 0) {
    tasksList.innerHTML =
      '<div class="text-center text-muted py-3">No tasks found</div>';
    return;
  }

  visible.forEach((t) => {
    const el = document.createElement("div");
    el.className = `task-item task-importance-${t.importance.toLowerCase()} list-group-item d-flex align-items-start ${
      t.done ? "completed" : ""
    }`;
    el.innerHTML = `
      <div class="form-check me-3">
        <input type="checkbox" class="form-check-input mt-2" ${
          t.done ? "checked" : ""
        }>
      </div>
      <div class="task-content flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <div class="task-text ${
            t.done ? "text-decoration-line-through text-muted" : "fw-bold"
          }">${t.text}</div>
          <div class="btn-group btn-group-sm d-flex flex-row gap-2 flex-shrink-0">
            <button class="btn btn-outline-primary btn-edit" title="Edit Task"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger btn-delete" title="Delete Task"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        <div class="meta-info small text-muted mt-1">
          <div class="d-flex align-items-center flex-wrap">
            <span class="me-3" title="Importance">${getImportanceBadge(
              t.importance
            )}</span>
            ${
              t.tags.length > 0
                ? t.tags
                    .map(
                      (tag) =>
                        `<span class="badge bg-info text-dark me-1" title="Tag: ${tag}">#${tag}</span>`
                    )
                    .join("")
                : ""
            }
          </div>
          <div class="mt-1">
            <span class="me-3 createdTime" title="Created On">${formatDate(
              t.createdOn
            )}</span>
            <br>
            ${
              t.createdOn !== t.updatedOn
                ? `<span class="me-3 updatedTime" title="Updated On">Updated: ${formatDate(
                    t.updatedOn
                  )}</span>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
    el.querySelector("input").addEventListener("change", () =>
      toggleDone(t.id)
    );
    el.querySelector(".btn-edit").addEventListener("click", () =>
      openEditModal(t.id)
    );
    el.querySelector(".btn-delete").addEventListener("click", () => {
      taskIdToDelete = t.id;
      deleteModal.show();
    });
    tasksList.appendChild(el);
  });

  const remaining = tasks.filter((t) => !t.done).length;
  remainingCount.innerText = `${remaining} remaining`;
}

addBtn.addEventListener("click", () => {
  addTask(inputTask.value, imp.value, tag.value);
  inputTask.value = "";
  tag.value = "";
});

inputTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(inputTask.value, imp.value, tag.value);
    inputTask.value = "";
    tag.value = "";
  }
});
tag.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(inputTask.value, imp.value, tag.value);
    inputTask.value = "";
    tag.value = "";
  }
});
imp.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(inputTask.value, imp.value, tag.value);
    inputTask.value = "";
    tag.value = "";
  }
});

filters.addEventListener("click", (e) => {
  if (e.target.closest("button"))
    applyFilter(e.target.closest("button").dataset.filter);
});

searchInput.addEventListener("input", renderTask);
clearCompleted.addEventListener("click", clearCompletedTasks);

clearAll.addEventListener("click", () => clearAllModal.show());
confirmClearAllBtn.addEventListener("click", () => {
  clearAllTask();
  clearAllModal.hide();
});

saveEditBtn.addEventListener("click", saveEditedTask);
confirmDeleteBtn.addEventListener("click", () => {
  if (taskIdToDelete) {
    deleteTask(taskIdToDelete);
    taskIdToDelete = null;
    deleteModal.hide();
  }
});

loadTasks();
