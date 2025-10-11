// import { formatDate, getImportanceBadge } from "./utils.js";
// import { toggleDone } from "./api.js";
// import { openEditModal, openDeleteModal } from "./modal.js";

// export let tasks = [];
// export let currentFilter = "all";
// export let currentPriorityFilter = "all";

// export const tasksList = document.getElementById("tasksList");

// export function renderTasks(taskArray) {
//   tasksList.innerHTML = "";
//   if (!taskArray.length) {
//     tasksList.innerHTML =
//       '<div class="text-center text-muted py-3">No tasks found</div>';
//     return;
//   }

//   taskArray.forEach((t) => {
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
//     el.querySelector(".btn-edit").addEventListener("click", () =>
//       openEditModal(t)
//     );
//     el.querySelector(".btn-delete").addEventListener("click", () =>
//       openDeleteModal(t._id)
//     );

//     tasksList.appendChild(el);
//   });
// }
