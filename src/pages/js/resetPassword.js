import AuthApi from "./AuthApi.js";
const authApi = new AuthApi();

const form = document.getElementById("reset-form");
const passwordInput = document.getElementById("newPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = localStorage.getItem("reset_email");
  const newPassword = passwordInput.value.trim();

  if (!newPassword) {
    alert("Please enter a new password");
    return;
  }

  try {
    await authApi.forgetPasswordReset(email, newPassword);

    alert("Password reset successful!");

    localStorage.removeItem("reset_email");

    window.location.href = "./login.html";
  } catch (error) {
    alert(error.message || "Failed to reset password");
  }
});
