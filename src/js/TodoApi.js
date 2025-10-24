import axios from 'axios';
import { showMessage } from '../pages/js/message.js';

const API_URL = 'http://localhost:3000/api/todos/';

export default class TodoApi {
  api = axios.create({
    baseURL: API_URL,
  });

  constructor() {
    this.api.interceptors.request.use(
      function (config) {
        const token = localStorage.getItem('access_token');

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      function (error) {
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
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const response = await axios.post(
              'http://localhost:3000/api/auth/protected/refresh-token',
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    'refresh_token'
                  )}`,
                },
              }
            );
            console.log(response);

            if (response) {
              const { access_token, refresh_token } = response.data;

              localStorage.setItem('access_token', access_token);
              localStorage.setItem('refresh_token', refresh_token);

              originalRequest.headers[
                'Authorization'
              ] = `Bearer ${access_token}`;

              return this.api(originalRequest);
            }
          } catch (refreshError) {
            console.log(refreshError);

            if (refreshError.response && refreshError.response.status === 401) {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');

              showMessage('Session expired. Please log in again.');

              window.location.href = '../pages/login.html';
            }
          }
        }

        if (error.response) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');

          showMessage('Invalid session. Please log in again.', 'danger');

          window.location.href = '../pages/login.html';
        }

        return Promise.reject(error);
      }
    );
  }

  async getTasks({ filter, priority, search }) {
    const res = await this.api.get('/', {
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

    await this.api.post('/', {
      title,
      isImportant: importance === 'important',
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
    await this.api.delete(`/clear/completed`);
  }

  async clearAllTasks() {
    await this.api.delete('/clear/all');
  }
}
