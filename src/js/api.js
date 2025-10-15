const API_URL = "http://localhost:3000/api/todos";

export async function getTasks({ filter, priority, search }) {
  const params = new URLSearchParams({ filter, priority, search });
  const res = await fetch(`${API_URL}?${params.toString()}`);
  return res.json();
}

export async function addTask(title, importance, tags) {
  const tagsArray = tags
    ? tags
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((t) => t.toLowerCase())
    : [];

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      isImportant: importance === "important",
      tags: tagsArray,
    }),
  });
}

export async function updateTask(id, data) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

export async function clearCompletedTasks() {
  await fetch(`${API_URL}/clear/completed`, { method: "DELETE" });
}

export async function clearAllTasks() {
  await fetch(`${API_URL}/clear/all`, { method: "DELETE" });
}
