import '../scss/styles.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import { loadTasks } from './events.js';

const access_token = localStorage.getItem('access_token');

if (!access_token) {
  window.location.href = '../pages/login.html';
}

loadTasks();
