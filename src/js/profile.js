import '../scss/styles.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import AuthApi from '../pages/js/AuthApi.js';

function profileIcon() {
  document.addEventListener('DOMContentLoaded', async () => {
    const emailSpan = document.getElementById('user-email');
    const preview = document.getElementById('profileImage');
    const logoutBtn = document.getElementById('logout-btn');

    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user.email;
    const username = userEmail.split('')[0];
    const authService = new AuthApi();
    const response = await authService.getUserInfo();

    console.log(response);

    if (response.name) {
      emailSpan.textContent = response.name;
    } else if (user && user.email && username) {
      emailSpan.textContent = username.toUpperCase();
    }

    if (response.profileImage) {
      preview.src = `http://localhost:3000/uploads/${response.profileImage}`;
    }

    logoutBtn.addEventListener('click', async () => {
      await authService.logout();
      window.location.href = './pages/loginPage.html';
    });
  });
}

profileIcon();
