// // Import our custom CSS
// import "../scss/login.scss";

// // Import all of Bootstrap’s JS
// import * as bootstrap from "bootstrap";

// import authApi from "./authApi.js";

// const loginForm = document.querySelector("form");
// const emailInput = document.getElementById("email-input");
// const passwordInput = document.getElementById("password-input");
// const submitButton = document.querySelector('button[type="submit"]');

// const authApi = new authApi();
// async function handleLogin(event) {
//   event.preventDefault();

//   const email = emailInput.value.trim();
//   const password = passwordInput.value;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!emailRegex.test(email)) {
//     showError("Please enter a valid email address");
//     return;
//   }

//   const originalText = submitButton.textContent;

//   submitButton.textContent = "Signing in...";
//   submitButton.disabled = true;

//   try {
//     await authApi.login(email, password);

//     showSuccess("Login successful! Redirecting...");

//     setTimeout(() => {
//       window.location.href = "../../index.html";
//     }, 1000);
//   } catch (error) {
//     showError(error.message || "Login failed. Please check your credentials.");
//   } finally {
//     submitButton.textContent = originalText;
//     submitButton.disabled = false;
//   }
// }

// if (loginForm) {
//   loginForm.addEventListener("submit", handleLogin);
// }

// function showError(message) {
//   const existingError = document.querySelector(".error-message");
//   if (existingError) {
//     existingError.remove();
//   }

//   const errorDiv = document.createElement("div");
//   errorDiv.className = "alert alert-danger error-message mt-3";
//   errorDiv.textContent = message;

//   loginForm.parentNode.insertBefore(errorDiv, loginForm.nextSibling);
// }

// function showSuccess(message) {
//   const existingMessage = document.querySelector(
//     ".error-message, .success-message"
//   );
//   if (existingMessage) {
//     existingMessage.remove();
//   }

//   const successDiv = document.createElement("div");
//   successDiv.className = "alert alert-success success-message mt-3";
//   successDiv.textContent = message;

//   loginForm.parentNode.insertBefore(successDiv, loginForm.nextSibling);
// }

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

    showMessage('Login successful! Redirecting...', 'success');

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

// function showError(message) {
//   const existingError = document.querySelector('.error-message');

//   if (existingError) {
//     existingError.remove();
//   }

//   const errorDiv = document.createElement('div');

//   errorDiv.className = 'alert alert-danger error-message mt-3';
//   errorDiv.textContent = message;
//   loginForm.parentNode.insertBefore(errorDiv, loginForm.nextSibling);
// }

// function showSuccess(message) {
//   const existingMessage = document.querySelector(
//     '.error-message, .success-message'
//   );

//   if (existingMessage) {
//     existingMessage.remove();
//   }

//   const successDiv = document.createElement('div');

//   successDiv.className = 'alert alert-success success-message mt-3';
//   successDiv.textContent = message;
//   loginForm.parentNode.insertBefore(successDiv, loginForm.nextSibling);
// }
