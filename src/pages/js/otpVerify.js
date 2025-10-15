// Import our custom CSS
//import "../scss/login.scss";
//import "../scss/otp.scss";

// Import all of Bootstrap’s JS
//import * as bootstrap from "bootstrap";
import { authAPI } from "./authApi.js";

function OTPInput() {
  const inputs = document.querySelectorAll("#otp > *[id]");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("keydown", function (event) {
      if (event.key === "Backspace") {
        inputs[i].value = "";
        if (i !== 0) inputs[i - 1].focus();
      } else {
        if (i === inputs.length - 1 && inputs[i].value !== "") {
          return true;
        } else if (event.keyCode > 47 && event.keyCode < 58) {
          inputs[i].value = event.key;
          if (i !== inputs.length - 1) inputs[i + 1].focus();
          event.preventDefault();
        } else if (event.keyCode > 64 && event.keyCode < 91) {
          inputs[i].value = String.fromCharCode(event.keyCode);
          if (i !== inputs.length - 1) inputs[i + 1].focus();
          event.preventDefault();
        }
      }
    });
  }
}
OTPInput();

async function handleOTPVerification() {
  const otpInputs = document.querySelectorAll("#otp input");
  const otp = Array.from(otpInputs)
    .map((input) => input.value)
    .join("");

  if (otp.length !== 6) {
    alert("Please enter the complete 6-digit OTP");
    return;
  }

  const email = localStorage.getItem("pendingEmail");
  if (!email) {
    alert("Email not found. Please try registering again.");
    window.location.href = "./signUpPage.html";
    return;
  }

  const validateButton = document.querySelector(".validate");
  const originalText = validateButton.textContent;
  validateButton.textContent = "Verifying...";
  validateButton.disabled = true;

  try {
    await authAPI.verifyOTP(email, otp);

    localStorage.removeItem("pendingEmail");

    const successMessage = document.createElement("div");
    successMessage.className = "alert alert-success mt-3";
    successMessage.textContent = "OTP verified successfully! Redirecting...";
    document.querySelector(".card").appendChild(successMessage);

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1500);
  } catch (error) {
    alert(error.message || "OTP verification failed. Please try again.");
  } finally {
    validateButton.textContent = originalText;
    validateButton.disabled = false;
  }
}

async function handleResendOTP() {
  const email = localStorage.getItem("pendingEmail");
  if (!email) {
    alert("Email not found. Please try registering again.");
    window.location.href = "./signUpPage.html";
    return;
  }

  // const resendLink = document.querySelector('.text-decoration-none .ms-3');
  // const originalText = resendLink.textContent;
  // resendLink.textContent = 'Sending...';
  // resendLink.style.pointerEvents = 'none';

  try {
    await authAPI.resendOTP(email);
    alert("OTP has been resent to your email.");
  } catch (error) {
    alert(error.message || "Failed to resend OTP. Please try again.");
  } finally {
    resendLink.textContent = originalText;
    resendLink.style.pointerEvents = "auto";
  }
}

const validateButton = document.querySelector(".validate");
if (validateButton) {
  validateButton.addEventListener("click", handleOTPVerification);
}

const resendLink = document.querySelector(".resend-link");
if (resendLink) {
  resendLink.addEventListener("click", (e) => {
    e.preventDefault();
    handleResendOTP();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  handleResendOTP();
});
