// Import our custom CSS
import '../scss/login.scss';
import '../scss/otp.scss';

// Import all of Bootstrap’s JS
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import AuthApi from './AuthApi.js';
import { showMessage } from './message.js';

const authApi = new AuthApi();

function otpInput() {
  const inputs = document.querySelectorAll('#otp > *[id]');

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('keydown', function (event) {
      if (event.key === 'Backspace') {
        inputs[i].value = '';

        if (i !== 0) {
          inputs[i - 1].focus();
        }
      } else {
        if (i === inputs.length - 1 && inputs[i].value !== '') {
          return true;
        } else if (event.keyCode > 47 && event.keyCode < 58) {
          inputs[i].value = event.key;
          if (i !== inputs.length - 1) {
            inputs[i + 1].focus();
          }
          event.preventDefault();
        } else if (event.keyCode > 64 && event.keyCode < 91) {
          inputs[i].value = String.fromCharCode(event.keyCode);

          if (i !== inputs.length - 1) {
            inputs[i + 1].focus();
          }

          event.preventDefault();
        }
      }
    });
  }
}
otpInput();

async function handleOtpVerification() {
  const otpInputs = document.querySelectorAll('#otp input');
  const otp = Array.from(otpInputs)
    .map((input) => input.value)
    .join('');

  if (otp.length !== 6) {
    showMessage('Please enter the complete 6-digit OTP', 'warning');
    return;
  }

  const email = localStorage.getItem('pendingEmail');

  if (!email) {
    showMessage('Email not found. Please try registering again.', 'warning');
    window.location.href = './signUp.html';
    return;
  }

  const validateButton = document.querySelector('.validate');
  const originalText = validateButton.textContent;
  validateButton.textContent = 'Verifying...';
  validateButton.disabled = true;

  try {
    await authApi.verifyOtp(email, otp);

    localStorage.removeItem('pendingEmail');

    showMessage('OTP verified successfully! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = '../../index.html';
    }, 1000);
  } catch (error) {
    showMessage(
      error.message || 'OTP verification failed. Please try again.',
      'danger'
    );
  } finally {
    validateButton.textContent = originalText;
    validateButton.disabled = false;
  }
}

async function handleResendOtp() {
  const email = localStorage.getItem('pendingEmail');
  if (!email) {
    showMessage('Email not found. Please try registering again.', 'warning');
    window.location.href = './signUp.html';
    return;
  }

  try {
    await authApi.resendOtp(email);

    showMessage('OTP has been resent to your email.');
  } catch (error) {
    showMessage(
      error.message || 'Failed to resend OTP. Please try again.',
      'danger'
    );
  } finally {
    resendLink.style.pointerEvents = 'auto';
  }
}

const validateButton = document.querySelector('.validate');

if (validateButton) {
  validateButton.addEventListener('click', handleOtpVerification);
}

const resendLink = document.querySelector('.resend-link');

if (resendLink) {
  resendLink.addEventListener('click', (e) => {
    e.preventDefault();
    handleResendOtp();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  handleResendOtp();
});
