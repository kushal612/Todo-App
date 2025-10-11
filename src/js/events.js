// //import { renderTasks, currentFilter } from "./dom.js";
// import { loadTasks } from "./main.js";
// import { currentFilter, currentPriorityFilter } from "./dom.js";
// import * as api from "./api.js";

// const clearCompletedBtn = document.getElementById("clearCompleted");
// const clearAllBtn = document.getElementById("clearAll");

// document.querySelectorAll(".priority").forEach((button) => {
//   button.addEventListener("click", (e) => {
//     const filter = e.target.dataset.filter;
//     document
//       .querySelectorAll(".priority")
//       .forEach((btn) => btn.classList.remove("active"));
//     e.target.classList.add("active");
//     currentPriorityFilter = filter;
//     loadTasks();
//   });
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
//   }
// });

// searchInput.addEventListener("input", loadTasks);

// clearCompletedBtn.addEventListener("click", () => {
//   api.clearCompleted();
//   loadTasks();
// });

// clearAllBtn.addEventListener("click", () => {
//   clearAllModal.show();
// });
// confirmClearAllBtn.addEventListener("click", () => {
//   clearAll();
//   clearAllModal.hide();
//   loadTasks();
// });
