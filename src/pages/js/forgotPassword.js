import '../scss/login.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import AuthApi from './AuthApi.js';

const authApi = new AuthApi();
const forgotPassForm = document.querySelector('form');
const emailInput = document.getElementById('email-input');
const submitButton = document.querySelector('button[type="submit"]');

async function handleForgotPass(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showError('Please enter a valid email address');
    return;
  }

  submitButton.textContent = 'Sending OTP...';
  submitButton.disabled = true;

  try {
    const response = await authApi.forgetPasswordSendOtp(email);
    console.log(response);

    showSuccess('OTP sent! Check your email...');

    localStorage.setItem('reset_email', email);

    setTimeout(() => {
      window.location.href = './passwordOtpVerify.html';
    }, 1500);
  } catch (error) {
    showError(error.message || 'Failed to send OTP. Please try again.');
  } finally {
    submitButton.textContent = 'Send OTP';
    submitButton.disabled = false;
  }
}

if (forgotPassForm) {
  forgotPassForm.addEventListener('submit', handleForgotPass);
}

function showError(message) {
  const errorDiv = document.createElement('div');

  errorDiv.className = 'alert alert-danger mt-3';
  errorDiv.textContent = message;
  forgotPassForm.appendChild(errorDiv);
}

function showSuccess(message) {
  const successDiv = document.createElement('div');

  successDiv.className = 'alert alert-success mt-3';
  successDiv.textContent = message;
  forgotPassForm.appendChild(successDiv);
}
