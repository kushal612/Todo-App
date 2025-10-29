import '../scss/login.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import AuthApi from './AuthApi.js';
import { showMessage } from './message.js';

const loginForm = document.querySelector('form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const submitButton = document.querySelector('button[type="submit"]');

const authApi = new AuthApi();

async function handleLogin(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email address', 'danger');
    return;
  }

  const originalText = submitButton.textContent;

  submitButton.textContent = 'Signing in...';
  submitButton.disabled = true;

  try {
    await authApi.login(email, password);

    const userData = { email };

    localStorage.setItem('user', JSON.stringify(userData));

    showMessage('Login successful', 'success');

    setTimeout(() => {
      window.location.href = '../../index.html';
    }, 1000);
  } catch (error) {
    showMessage(
      error.message || 'Login failed. Please check your credentials.',
      'danger'
    );
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}
