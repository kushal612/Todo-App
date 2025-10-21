// Import our custom CSS
import "../scss/login.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import AuthApi from "./AuthApi.js";

const signupForm = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit-btn");
const authApi = new AuthApi();

async function handleSignup(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showError("Please enter a valid email address");
    return;
  }

  const originalText = submitButton.textContent;
  submitButton.textContent = "Signing up...";
  submitButton.disabled = true;

  try {
    const response = await authApi.register(email, password);
    console.log("Registration response:", response);

    localStorage.setItem("pendingEmail", email);

    showSuccess("Registration successful! Please check your email for OTP.");

    setTimeout(() => {
      window.location.href = "./otpVerify.html";
    }, 1000);
  } catch (error) {
    console.error("Registration error:", error);
    showError(error.error);
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      showError(
        "Backend server is not running. Please start your backend server and try again."
      );
    } else {
      showError(error.message || "Registration failed. Please try again.");
    }
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
} else {
  console.error("Signup form not found!");
}

function showSuccess(message) {
  const existingMessage = document.querySelector(
    ".error-message, .success-message"
  );
  if (existingMessage) {
    existingMessage.remove();
  }

  const successDiv = document.createElement("div");
  successDiv.className = "alert alert-success success-message mt-3";
  successDiv.textContent = message;

  signupForm.parentNode.insertBefore(successDiv, signupForm.nextSibling);
}

function showError(message) {
  const existingError = document.querySelector(".error-message");

  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger error-message mt-3";
  errorDiv.textContent = message;

  signupForm.parentNode.insertBefore(errorDiv, signupForm.nextSibling);
}
