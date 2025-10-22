import AuthApi from './AuthApi.js';
const authApi = new AuthApi();

const form = document.getElementById('reset-form');
const passwordInput = document.getElementById('newPassword');
const otpInput = document.getElementById('otp');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = localStorage.getItem('reset_email');
  const otp = otpInput.value.trim();
  const newPassword = passwordInput.value.trim();

  if (!newPassword || !otp) {
    showMessage('Please enter a new password and otp', 'warning');
    return;
  }

  try {
    await authApi.forgetPasswordReset(email, otp, newPassword);

    showMessage('Password reset successful!', 'success');

    localStorage.removeItem('reset_email');

    setTimeout(() => {
      window.location.href = './login.html';
    }, 2000);
  } catch (error) {
    showMessage('Failed to reset password', 'danger');
    console.log(error.message);
  }
});

function showMessage(text, type = 'info') {
  messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
}
