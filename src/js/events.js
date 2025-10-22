import * as bootstrap from 'bootstrap';
import TodoApi from './TodoApi.js';
import {
  renderTasks,
  getCurrentFilter,
  getCurrentPriorityFilter,
  getTaskIdToEdit,
  setCurrentFilter,
  setCurrentPriorityFilter,
} from './dom.js';

const todoApi = new TodoApi();
const inputTask = document.getElementById('inputTask');
const addBtn = document.getElementById('addBtn');
const tag = document.getElementById('tagInput');
const imp = document.getElementById('impOrder');
const filters = document.getElementById('filters');
const searchInput = document.getElementById('searchInput');
const clearCompleted = document.getElementById('clearCompleted');
const clearAll = document.getElementById('clearAll');
const clearAllModal = new bootstrap.Modal(
  document.getElementById('clearAllModal')
);
const confirmClearAllBtn = document.getElementById('confirmClearAllBtn');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const saveEditBtn = document.getElementById('saveEditBtn');
const editTaskInput = document.getElementById('editTaskInput');
const editImportanceSelect = document.getElementById('editImportanceSelect');
const editTagsInput = document.getElementById('editTagsInput');

export async function loadTasks() {
  const result = await todoApi.getTasks({
    filter: getCurrentFilter(),
    priority: getCurrentPriorityFilter(),
    search: searchInput.value.trim(),
  });
  renderTasks(result);
}

addBtn.addEventListener('click', async () => {
  if (!inputTask.value.trim()) {
    return;
  }

  await todoApi.addTask(inputTask.value, imp.value, tag.value);
  inputTask.value = '';
  tag.value = '';
  await loadTasks();
});

filters.addEventListener('click', async (e) => {
  if (e.target.closest('button')) {
    document
      .querySelectorAll('#filters button')
      .forEach((b) => b.classList.remove('active'));

    e.target.closest('button').classList.add('active');

    setCurrentFilter(e.target.closest('button').dataset.filter);
    await loadTasks();
  }
});

document.querySelectorAll('.priority').forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    document
      .querySelectorAll('.priority')
      .forEach((b) => b.classList.remove('active'));

    e.target.classList.add('active');

    setCurrentPriorityFilter(e.target.dataset.filter);
    await loadTasks();
  });
});

searchInput.addEventListener('input', loadTasks);

clearCompleted.addEventListener('click', async () => {
  await todoApi.clearCompletedTasks();

  await loadTasks();
});

clearAll.addEventListener('click', () => clearAllModal.show());
confirmClearAllBtn.addEventListener('click', async () => {
  await todoApi.clearAllTasks();

  clearAllModal.hide();

  await loadTasks();
});

saveEditBtn.addEventListener('click', async () => {
  const data = {
    title: editTaskInput.value.trim(),
    isImportant: editImportanceSelect.value === 'important',
    tags: editTagsInput.value
      ? editTagsInput.value
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((t) => t.toLowerCase())
      : [],
  };

  await todoApi.updateTask(getTaskIdToEdit(), data);

  editModal.hide();

  await loadTasks();
});
