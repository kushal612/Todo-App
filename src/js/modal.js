import * as bootstrap from "bootstrap";

export const editModal = new bootstrap.Modal(
  document.getElementById("editModal")
);
export const clearAllModal = new bootstrap.Modal(
  document.getElementById("clearAllModal")
);
export const deleteModal = new bootstrap.Modal(
  document.getElementById("deleteModal")
);

export function showEditModal(task) {
  const editTaskInput = document.getElementById("editTaskInput");
  const editImportanceSelect = document.getElementById("editImportanceSelect");
  const editTagsInput = document.getElementById("editTagsInput");

  editTaskInput.value = task.title;
  editImportanceSelect.value = task.isImportant ? "high" : "normal";
  editTagsInput.value = task.tags?.join(", ") || "";

  editModal.show();
}

export function showDeleteModal(id) {
  window.taskIdToDelete = id;
  deleteModal.show();
}
