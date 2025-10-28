import '../scss/styles.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import AuthApi from '../pages/js/authApi.js';
import { showMessage } from '../pages/js/message.js';

function editProfile() {
  document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('edit-profile-form');
    const profileImage = document.getElementById('profileImage');
    const preview = document.getElementById('preview');
    const userEmail = document.getElementById('user-email');

    const user = JSON.parse(localStorage.getItem('user'));
    const authService = new AuthApi();
    const userInfo = await authService.getUserInfo();

    if (userInfo.profileImage) {
      preview.src = 'http://localhost:3000/uploads/' + userInfo.profileImage;
    }
    userEmail.innerText = user.email;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      await authService.updateUserInfo(profileImage.files[0]);
      showMessage('Profile Updated', 'success');

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1500);
    });
  });
}

editProfile();
