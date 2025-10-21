import authApi from "./authApi.js";
const authAPI = new authApi();

const otpForm = document.getElementById("otp-form");
const otpInput = document.getElementById("otp");

otpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = localStorage.getItem("reset_email");
  const otp = otpInput.value.trim();

  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  try {
    await authAPI.forgetPasswordVerifyOtp(email, otp);
    alert("OTP Verified Successfully!");

    // Redirect to reset password page
    window.location.href = "./resetPassword.html";
  } catch (error) {
    alert(error.message || "Invalid OTP. Please try again.");
  }
});
