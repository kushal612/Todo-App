// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap’s JS
import * as bootstrap from "bootstrap";

let tasks = [];
let currentFilter = "all";

const inputTask = document.getElementById("inputTask");
const addBtn = document.getElementById("addBtn");
const tasksList = document.getElementById("tasksList");
const imp = document.getElementById("impOrder");
const tag = document.getElementById("tagInput");
const tagValue = tag.value;
const impOrder = imp.value;

console.log(impOrder);
console.log(tagValue);

const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const clearCompleted = document.getElementById("clearCompleted");
const clearAll = document.getElementById("clearAll");
const remainingCount = document.getElementById("remainingCount");

// Elements for the Edit Modal
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editTaskInput = document.getElementById("editTaskInput");
const editImportanceSelect = document.getElementById("editImportanceSelect");
const editTagsInput = document.getElementById("editTagsInput");
const saveEditBtn = document.getElementById("saveEditBtn");

// Elements for the Clear All Confirmation Modal
const clearAllModal = new bootstrap.Modal(
  document.getElementById("clearAllModal")
);
const confirmClearAllBtn = document.getElementById("confirmClearAllBtn");

// Elements for the Delete Confirmation Modal
const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let taskIdToEdit = null;
let taskIdToDelete = null;

function uId() {
  return crypto.randomUUID();
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("task")) || [];

  // Data Migration: Ensure all loaded tasks have new properties
  tasks = tasks.map((t) => ({
    ...t, // Keep existing properties
    importance: t.importance,
    tags: Array.isArray(t.tags) ? t.tags : [], // Default to empty array if missing or not an array
    createdOn: t.createdOn || new Date().toISOString(), // Default to current time if missing
    updatedOn: t.updatedOn || t.createdOn || new Date().toISOString(), // Default to createdOn or current time
  }));
}

function saveTask() {
  localStorage.setItem("task", JSON.stringify(tasks));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return `${date.toLocaleDateString(
    undefined,
    dateOptions
  )} at ${date.toLocaleTimeString(undefined, timeOptions)}`;
}

function addTask(text, importance, tags) {
  if (!text.trim()) {
    return;
  }
  const now = new Date().toISOString();
  tasks.push({
    id: uId(),
    text: text.trim(),
    done: false,
    importance: importance,
    tags: tags
      .split(/[\s,]+/) // Split by space or comma
      .filter((tag) => tag.trim() !== "")
      .map((tag) => tag.trim().toLowerCase()),
    createdOn: now,
    updatedOn: now,
  });
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
    t.updatedOn = new Date().toISOString(); // Update timestamp on toggle
    saveTask();
    renderTask();
  }
}

function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    taskIdToEdit = id;
    editTaskInput.value = task.text;
    editImportanceSelect.value = task.importance;
    editTagsInput.value = task.tags.join(", "); // Show tags as comma-separated string
    editModal.show();
  }
}

function saveEditedTask() {
  const id = taskIdToEdit;
  const newText = editTaskInput.value.trim();
  const newImportance = editImportanceSelect.value;
  const newTags = editTagsInput.value;

  if (newText) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.text = newText;
      task.importance = newImportance;
      task.tags = newTags
        .split(/[\s,]+/)
        .filter((tag) => tag.trim() !== "")
        .map((tag) => tag.trim().toLowerCase());
      task.updatedOn = new Date().toISOString();
      saveTask();
      renderTask();
    }
  }
  editModal.hide();
  taskIdToEdit = null;
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
  // Use 'active' class for Bootstrap styling
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

    // Search logic: check text OR tags
    if (
      q &&
      !t.text.toLowerCase().includes(q) &&
      !t.tags.some((tag) => tag.includes(q))
    )
      return false;

    return true;
  });

  // Sort by importance (High > Medium > Low), then by creation date
  visible.sort((a, b) => {
    const importanceOrder = { high: 3, medium: 2, low: 1 };

    // Use the OR operator (||) to safely fall back to 'medium' if importance is missing
    const aImportance = a.importance ? a.importance.toLowerCase() : "medium";
    const bImportance = b.importance ? b.importance.toLowerCase() : "medium";

    const importanceDiff =
      importanceOrder[bImportance] - importanceOrder[aImportance];

    if (importanceDiff !== 0) {
      return importanceDiff;
    }
    // Secondary sort by creation date (newest first)
    return new Date(b.createdOn) - new Date(a.createdOn);
  });

  tasksList.innerHTML = "";
  if (visible.length === 0) {
    tasksList.innerHTML =
      '<div class="text-center text-muted py-3">No tasks found</div>';
  } else {
    visible.forEach((t) => {
      const el = document.createElement("div");
      // Added list-group-item and d-flex for better Bootstrap integration
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
              <span class="me-3" title="Created On">Created: ${formatDate(
                t.createdOn
              )}</span>
              ${
                t.createdOn !== t.updatedOn
                  ? `<span title="Last Updated">Updated: ${formatDate(
                      t.updatedOn
                    )}</span>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;

      // Event Listeners for the task item
      el.querySelector("input").addEventListener("change", () =>
        toggleDone(t.id)
      );

      el.querySelector(".btn-edit").addEventListener("click", () =>
        openEditModal(t.id)
      );

      el.querySelector(".btn-delete").addEventListener("click", () => {
        taskIdToDelete = t.id;
        deleteModal.show(); // Show delete confirmation modal
      });

      tasksList.appendChild(el);
    });
  }

  const remaining = tasks.filter((t) => !t.done).length;
  remainingCount.innerText = `${remaining} remaining`;
}

// --- Event Listeners ---

// Add Task (Default to 'medium' importance and no tags for simple input)
addBtn.addEventListener("click", () => {
  addTask(inputTask.value, impOrder, tagValue);
  inputTask.value = "";
});
inputTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(inputTask.value, impOrder, tagValue);
    inputTask.value = "";
  }
});

// Filters
filters.addEventListener("click", (e) => {
  if (e.target.closest("button"))
    applyFilter(e.target.closest("button").dataset.filter);
});

// Search
searchInput.addEventListener("input", renderTask);

// Clear Completed
clearCompleted.addEventListener("click", clearCompletedTasks);

// Clear All Confirmation
clearAll.addEventListener("click", () => {
  clearAllModal.show();
});

confirmClearAllBtn.addEventListener("click", () => {
  clearAllTask();
  clearAllModal.hide();
});

// Save Edit Handler
saveEditBtn.addEventListener("click", saveEditedTask);

// Delete Confirmation Handler
confirmDeleteBtn.addEventListener("click", () => {
  if (taskIdToDelete) {
    deleteTask(taskIdToDelete);
    taskIdToDelete = null;
    deleteModal.hide();
  }
});

// --- Initialization ---
loadTasks(impOrder);
renderTask();
