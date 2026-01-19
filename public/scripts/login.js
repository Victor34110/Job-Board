document.addEventListener('DOMContentLoaded', () => {
  redirectIfAuthenticated();
});

function validateLoginEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'L\'email est obligatoire';
  }
  if (!emailRegex.test(email)) {
    return 'Format d\'email invalide';
  }
  return null;
}

function validateLoginPassword(password) {
  if (!password) {
    return 'Le mot de passe est obligatoire';
  }
  return null;
}

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  hideError('email-error');
  hideError('password-error');
  
  const emailError = validateLoginEmail(email);
  const passwordError = validateLoginPassword(password);
  
  if (emailError) {
    showError('email-error', emailError);
    return;
  }
  if (passwordError) {
    showError('password-error', passwordError);
    return;
  }
  
  const submitButton = document.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Connexion en cours...';
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      showNotification('Connexion réussie !', 'success');
      saveUser(data.user);
      setTimeout(() => {
        window.location.href = '/jobs';
      }, 1000);
    } else {
      showError('email-error', data.message || 'Email ou mot de passe incorrect');
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  } catch (error) {
    showNotification('Erreur de connexion au serveur', 'error');
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  if (emailInput) {
    emailInput.addEventListener('focus', () => hideError('email-error'));
  }
  if (passwordInput) {
    passwordInput.addEventListener('focus', () => hideError('password-error'));
  }
});