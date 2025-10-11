// import { loadTasks } from "./main.js";

// const API_URL = "http://localhost:3000/api/tasks";

// export async function getTasks({ filter, priority, search }) {
//   const params = new URLSearchParams({
//     filter,
//     priority,
//     search,
//   });
//   const res = await fetch(`${API_URL}?${params.toString()}`);
//   return res.json();
// }

// export async function createTask(task) {
//   await fetch(API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(task),
//   });
// }

// export async function updateTask(id, data) {
//   await fetch(`${API_URL}/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
// }

// export async function deleteTaskById(id) {
//   await fetch(`${API_URL}/${id}`, { method: "DELETE" });
// }

// export async function clearCompleted() {
//   await fetch(`${API_URL}/clear/completed`, { method: "DELETE" });
// }

// export async function clearAll() {
//   await fetch(`${API_URL}/clear/all`, { method: "DELETE" });
// }

// export async function toggleDone(id, done) {
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
