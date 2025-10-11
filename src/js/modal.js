// import * as bootstrap from "bootstrap";
// import { updateTask, deleteTaskById } from "./api.js";
// import { loadTasks } from "./main.js";

// const editModal = new bootstrap.Modal(document.getElementById("editModal"));
// const editTaskInput = document.getElementById("editTaskInput");
// const editImportanceSelect = document.getElementById("editImportanceSelect");
// const editTagsInput = document.getElementById("editTagsInput");
// const saveEditBtn = document.getElementById("saveEditBtn");

// const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
// const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// let taskIdToEdit = null;
// let taskIdToDelete = null;

// export function openEditModal(task) {
//   taskIdToEdit = task._id;
//   editTaskInput.value = task.title;
//   editImportanceSelect.value = task.isImportant ? "important" : "normal";
//   editTagsInput.value = task.tags?.join(", ") || "";
//   editModal.show();
// }

// saveEditBtn.addEventListener("click", async () => {
//   if (!taskIdToEdit) return;
//   const updatedData = {
//     title: editTaskInput.value.trim(),
//     isImportant: editImportanceSelect.value === "important",
//     tags: editTagsInput.value
//       .split(/[\s,]+/)
//       .filter((tag) => tag.trim() !== "")
//       .map((tag) => tag.trim().toLowerCase()),
//   };

//   await updateTask(taskIdToEdit, updatedData);
//   editModal.hide();
//   taskIdToEdit = null;
//   loadTasks();
// });

// export function openDeleteModal(id) {
//   taskIdToDelete = id;
//   deleteModal.show();
// }

// confirmDeleteBtn.addEventListener("click", async () => {
//   if (taskIdToDelete) {
//     await deleteTaskById(taskIdToDelete);
//     taskIdToDelete = null;
//     deleteModal.hide();
//     loadTasks();
//   }
// });
