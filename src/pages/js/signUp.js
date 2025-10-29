// Import our custom CSS
import '../scss/login.scss';
// Import all of Bootstrap's JS
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import { showMessage } from './message.js';
import AuthApi from './AuthApi.js';

const signupForm = document.getElementById('signup-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submit-btn');
const authApi = new AuthApi();

async function handleSignup(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email address', 'danger');
    return;
  }

  const originalText = submitButton.textContent;

  submitButton.textContent = 'Signing up...';
  submitButton.disabled = true;

  try {
    const response = await authApi.register(email, password);
    console.log('Registration response:', response);

    localStorage.setItem('pendingEmail', email);

    showMessage(
      'Registration successful! Please check your email for OTP.',
      'success'
    );

    setTimeout(() => {
      window.location.href = './otpVerify.html';
    }, 1000);
  } catch (error) {
    console.error('Registration error:', error);
    showMessage(`${error.error}`, 'danger');
    if (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    ) {
      showMessage(
        'Backend server is not running. Please start your backend server and try again.'
      );
    } else {
      showMessage(
        error.message || 'Registration failed. Please try again.',
        'danger'
      );
    }
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

if (signupForm) {
  signupForm.addEventListener('submit', handleSignup);
}
