import AuthApi from './authApi.js';
import { showMessage } from './message.js';

const authApi = new AuthApi();
const form = document.getElementById('resetPasswordForm');
const emailInput = document.getElementById('emailInput');
const oldPasswordInput = document.getElementById('oldPasswordInput');
const newPasswordInput = document.getElementById('newPasswordInput');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const oldPassword = oldPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();

  if (!email || !oldPassword || !newPassword) {
    showMessage('All fields are required', 'danger');
    return;
  }

  try {
    await authApi.resetNewPassword(email, oldPassword, newPassword);
    showMessage('Password updated successfully! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  } catch (error) {
    showMessage(error.message || 'Something went wrong', 'danger');
  }
});
