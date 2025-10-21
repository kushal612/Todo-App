import authApi from "./authApi.js";

const authAPI = new authApi();

const form = document.getElementById("resetPasswordForm");
const emailInput = document.getElementById("emailInput");
const oldPasswordInput = document.getElementById("oldPasswordInput");
const newPasswordInput = document.getElementById("newPasswordInput");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const oldPassword = oldPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();

  if (!email || !oldPassword || !newPassword) {
    showMessage("All fields are required", "danger");
    return;
  }

  try {
    await authAPI.resetNewPassword(email, oldPassword, newPassword);
    showMessage("Password updated successfully! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
  } catch (error) {
    showMessage(error.message || "Something went wrong", "danger");
  }
});

function showMessage(text, type = "info") {
  messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
}
