import axios from "axios";

const API_URL = "http://localhost:3000/api/todos/tasks";

export default class todoApi {
  api = axios.create({
    baseURL: API_URL,
  });

  constructor() {
    this.api.interceptors.request.use(
      function (config) {
        const token = localStorage.getItem("access_token");

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      function (error) {
        console.log(error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response &&
          error.response.data.message === "jwt expired" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const response = await axios.post(
              "http://localhost:3001/api/auth/protected/refresh-token",
              { refresh_token: localStorage.getItem("refresh_token") }
            );
            console.log(response);

            if (response) {
              const { access_token, refresh_token } = response.data;

              localStorage.setItem("access_token", access_token);
              localStorage.setItem("refresh_token", refresh_token);

              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${access_token}`;

              return this.api(originalRequest);
            }
          } catch (refreshError) {
            console.log(refreshError);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            window.location.reload();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async getTasks({ filter, priority, search }) {
    const res = await this.api.get("/", {
      params: { filter, priority, search },
    });

    return res.data;
  }

  async addTask(title, importance, tags) {
    const tagsArray = tags
      ? tags
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((t) => t.toLowerCase())
      : [];

    await this.api.post("/", {
      title,
      isImportant: importance === "important",
      tags: tagsArray,
    });
  }

  async updateTask(id, data) {
    await this.api.put(`/${id}`, data);
  }

  async deleteTask(id) {
    await this.api.delete(`/${id}`);
  }

  async clearCompletedTasks() {
    await this.api.delete("/clear/completed");
  }

  async clearAllTasks() {
    await this.api.delete("/clear/all");
  }
}
