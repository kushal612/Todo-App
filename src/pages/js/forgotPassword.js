import '../scss/login.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import AuthApi from './AuthApi.js';
import { showMessage } from './message.js';

const authApi = new AuthApi();
const forgotPassForm = document.querySelector('form');
const emailInput = document.getElementById('email-input');
const submitButton = document.querySelector('button[type="submit"]');

async function handleForgotPass(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email address', 'danger');
    return;
  }

  submitButton.textContent = 'Sending OTP...';
  submitButton.disabled = true;

  try {
    const response = await authApi.forgetPasswordSendOtp(email);
    console.log(response);

    showMessage('OTP sent! Check your email...', 'info');

    localStorage.setItem('reset_email', email);

    setTimeout(() => {
      window.location.href = './resetForgotPassword.html';
    }, 1500);
  } catch (error) {
    showMessage(
      error.message || 'Failed to send OTP. Please try again.',
      'danger'
    );
  } finally {
    submitButton.textContent = 'Send OTP';
    submitButton.disabled = false;
  }
}

if (forgotPassForm) {
  forgotPassForm.addEventListener('submit', handleForgotPass);
}
