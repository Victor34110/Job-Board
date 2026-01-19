function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function toggleDescription(button) {
  const item = button.closest('.job-item');
  if (!item) return;

  const description = item.querySelector('.job-description');
  if (!description) return;

  const isVisible = description.style.display !== 'none';

  if (isVisible) {
    description.style.display = 'none';
    button.textContent = 'En savoir plus';
  } else {
    description.style.display = 'block';
    button.textContent = 'Réduire';
  }
}

async function loadItems(apiUrl, listElementId, createElementFn, messages) {
  const listElement = document.getElementById(listElementId);
  if (!listElement) return;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result.success) throw new Error(result.message);

    listElement.innerHTML = '';

    if (result.data?.length > 0) {
      result.data.forEach(item => {
        listElement.appendChild(createElementFn(item));
      });
    } else {
      listElement.innerHTML = `
        <div class="no-jobs flex-col gap-1 padding-2">
          <h3>${messages.noResults}</h3>
          <p>Revenez plus tard pour découvrir de nouvelles opportunités !</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Erreur:', error);
    listElement.innerHTML = `
      <div class="error-message flex-col gap-1 padding-2">
        <h3>Erreur</h3>
        <p>${messages.error}</p>
        <button class="retry-btn">Réessayer</button>
      </div>
    `;
  }
}

function initPage(config) {
  const load = () => {
    loadItems(config.apiUrl, config.listElementId, config.createElementFn, config.messages);
  };

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('learn-more-btn')) {
      toggleDescription(e.target);
    } else if (e.target.classList.contains('retry-btn')) {
      load();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => load());
  } else {
    load();
  }
}

// ================= NOTIFICATIONS =================
function showNotification(message, type = 'success', duration = 4000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icon = type === 'success' ? 'OK' : type === 'error' ? 'ERREUR' : type === 'warning' ? 'ATTENTION' : 'INFO';
  
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Fermeture automatique
  const autoClose = setTimeout(() => {
    closeNotification(notification);
  }, duration);
  
  // Fermeture manuelle
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    clearTimeout(autoClose);
    closeNotification(notification);
  });
  
  // Fermeture au clic sur la notification
  notification.addEventListener('click', () => {
    clearTimeout(autoClose);
    closeNotification(notification);
  });
}

function closeNotification(notification) {
  notification.classList.add('hide');
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// ================= HAMBURGER MENU =================
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const nav = document.querySelector('.nav');

  if (!hamburgerBtn || !nav) return;

  const toggleMenu = () => {
    nav.classList.toggle('is-active');
    hamburgerBtn.classList.toggle('is-active');
  };

  hamburgerBtn.addEventListener('click', toggleMenu);

  nav.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      nav.classList.remove('is-active');
      hamburgerBtn.classList.remove('is-active');
    })
  );

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      nav.classList.remove('is-active');
      hamburgerBtn.classList.remove('is-active');
    }
  });
}

// ================= PROTECTED PAGES =================
function initProtectedPage() {
  // Vérifier l'authentification et initialiser la page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requireAuth();
      setupPageHandlers();
    });
  } else {
    requireAuth();
    setupPageHandlers();
  }
}

function setupPageHandlers() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  displayUserInfo();
}

