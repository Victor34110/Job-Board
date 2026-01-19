function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

function logout() {
  localStorage.removeItem('user');
  fetch('/api/auth/logout', { method: 'POST' })
    .then(() => {
      showNotification('Déconnexion réussie', 'info');
      setTimeout(() => window.location.href = '/login', 1000);
    });
}

function requireAuth() {
  if (!getUser()) window.location.href = '/login';
}

function redirectIfAuthenticated() {
  if (getUser()) window.location.href = '/jobs';
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

function displayUserInfo() {
  const user = getUser();
  if (user) {
    document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = `${user.first_name} ${user.last_name}`;
    });
  }
}