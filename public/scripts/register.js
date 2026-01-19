// Vérifier si l'utilisateur est déjà connecté et le rediriger

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'L\'email est obligatoire';
  }
  if (!emailRegex.test(email)) {
    return 'Format d\'email invalide';
  }
  return null;
}

function validatePassword(password) {
  if (!password) {
    return 'Le mot de passe est obligatoire';
  }
  if (password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  return null;
}

async function handleRegister(event) {
  event.preventDefault();
  
  const first_name = document.getElementById('firstname').value.trim();
  const last_name = document.getElementById('lastname').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  hideError('firstname-error');
  hideError('lastname-error');
  hideError('email-error');
  hideError('password-error');
  
  if (!first_name) {
    showError('firstname-error', 'Le prénom est obligatoire');
    return;
  }
  if (!last_name) {
    showError('lastname-error', 'Le nom est obligatoire');
    return;
  }
  
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  
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
  submitButton.textContent = 'Inscription en cours...';
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ first_name, last_name, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      showNotification('Inscription réussie !', 'success');
      saveUser(data.user);
      setTimeout(() => {
        window.location.href = '/jobs';
      }, 1000);
    } else {
      if (data.message.includes('email')) {
        showError('email-error', data.message);
      } else if (data.message.includes('mot de passe')) {
        showError('password-error', data.message);
      } else {
        showError('email-error', data.message || 'Une erreur est survenue');
      }
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
  redirectIfAuthenticated();
  
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', handleRegister);
  }
  
  const inputs = ['firstname', 'lastname', 'email', 'password'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('focus', () => hideError(`${id}-error`));
    }
  });
});