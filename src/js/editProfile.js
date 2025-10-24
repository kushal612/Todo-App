import { showMessage } from '../pages/js/message.js';

function editProfile() {
  document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('profileImage');
    const form = document.getElementById('edit-profile-form');
    const preview = document.getElementById('preview');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user.profileImage) {
      preview.src = user.profileImage;
    }

    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          preview.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      user.profileImage = preview.src;
      showMessage('Image is updated', 'success');
      localStorage.setItem('user', JSON.stringify(user));
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1500);
    });
  });
}

editProfile();
