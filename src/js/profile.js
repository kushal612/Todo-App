import '../scss/styles.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

function profileIcon() {
  document.addEventListener('DOMContentLoaded', () => {
    const emailSpan = document.getElementById('user-email');
    const preview = document.getElementById('preview');
    const logoutBtn = document.getElementById('logout-btn');
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user.email;
    const username = userEmail.split('')[0];

    if (user && user.email && username) {
      emailSpan.textContent = username.toUpperCase();
    }

    if (user.profileImage) {
      preview.src = user.profileImage;
    }

    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = './pages/loginPage.html';
    });
  });
}

profileIcon();
