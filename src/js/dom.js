import TodoApi from './TodoApi.js';
import * as bootstrap from 'bootstrap';
import { formatDate, getImportanceBadge, renderTags } from './utils.js';

let tasks = [];
let currentFilter = 'all';
let currentPriorityFilter = 'all';
let taskIdToEdit = null;
let taskIdToDelete = null;
const tasksList = document.getElementById('tasksList');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const editTaskInput = document.getElementById('editTaskInput');
const editImportanceSelect = document.getElementById('editImportanceSelect');
const editTagsInput = document.getElementById('editTagsInput');
const deleteBtn = document.getElementById('confirmDeleteBtn');
const todoApi = new TodoApi();

export function getCurrentFilter() {
  return currentFilter;
}
export function getCurrentPriorityFilter() {
  return currentPriorityFilter;
}
export function getTaskIdToEdit() {
  return taskIdToEdit;
}
export function getTaskIdToDelete() {
  return taskIdToDelete;
}
export function setTaskIdToDelete(value) {
  taskIdToDelete = value;
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
async function handleDeleteTask(taskId) {
  await todoApi.deleteTask(taskId);

  const updatedTasks = await todoApi.getTasks({
    currentFilter,
    currentPriorityFilter,
    search: '',
  });

  renderTasks(updatedTasks);
  deleteModal.hide();
}

deleteBtn.addEventListener('click', () => {
  if (getTaskIdToDelete()) {
    handleDeleteTask(getTaskIdToDelete());
  }
});

export function renderTasks(newTasks) {
  tasks = newTasks;
  tasksList.innerHTML = '';

  if (!tasks.length) {
    tasksList.innerHTML = `<div class="text-center text-muted py-3">No tasks found</div>`;
    return;
  }

  tasks.forEach((t) => {
    const el = document.createElement('div');

    el.className = `task-item list-group-item d-flex align-items-start ${
      t.isCompleted ? 'completed' : ''
    }`;

    el.innerHTML = `
      <div class="form-check me-3">
        <input type="checkbox" class="form-check-input mt-2" ${
          t.isCompleted ? 'checked' : ''
        }>
      </div>
      <div class="task-content flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <div class="task-text ${
            t.isCompleted
              ? 'text-decoration-line-through text-muted'
              : 'fw-bold'
          }">${t.title}</div>
          <div class="btn-group btn-group-sm d-flex flex-row gap-2">
            <button class="btn btn-outline-primary btn-edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger btn-delete"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        <div class="meta-info small text-muted mt-1">
          <div class="d-flex flex-wrap">
            <span class="me-3">${getImportanceBadge(t.isImportant)}</span>
            ${renderTags(t.tags)}
          </div>
          <div class="mt-1">
            <span class="me-3">Created: ${formatDate(t.createdAt)}</span>
            ${
              t.createdAt !== t.updatedAt
                ? `<br><span>Updated: ${formatDate(t.updatedAt)}</span>`
                : ''
            }
          </div>
        </div>
      </div>
    `;

    el.querySelector('input').addEventListener('change', async (e) => {
      await todoApi.updateTask(t._id, { isCompleted: e.target.checked });
      t.isCompleted = e.target.checked;

      const updatedTasks = await todoApi.getTasks({
        currentFilter,
        currentPriorityFilter,
        search: '',
      });

      renderTasks(updatedTasks);
    });

    el.querySelector('.btn-edit').addEventListener('click', () => {
      setTaskIdToEdit(t._id);

      editTaskInput.value = t.title;
      editImportanceSelect.value = t.isImportant ? 'important' : 'normal';
      editTagsInput.value = t.tags?.join(', ') || '';

      editModal.show();
    });

    el.querySelector('.btn-delete').addEventListener('click', async () => {
      setTaskIdToDelete(t._id);
      deleteModal.show();
    });

    tasksList.appendChild(el);
  });
}

export function profileIcon() {
  document.addEventListener('DOMContentLoaded', () => {
    const emailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.email && emailSpan) {
      emailSpan.textContent = user.email;
    }

    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = './pages/loginPage.html';
    });
  });
}
