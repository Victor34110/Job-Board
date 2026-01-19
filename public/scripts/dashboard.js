let user;
let isAdmin;

function initDashboard() {
  requireAuth();
  user = getUser();
  isAdmin = user && user.role === 'admin';
}

async function loadUserProfile() {
  if (!user) return;
  
  try {
    const response = await fetch(`/api/applications/user/${user.id}`, {
      credentials: 'include'
    });
    const data = await response.json();
    
    const container = document.getElementById('dashboardContent');
    
    if (data.success && data.data.length > 0) {
      const applicationsHTML = `
        <div class="applications-section flex-col gap-1">
          <h2>Mes Candidatures (${data.count})</h2>
          <div class="applications-list">
            ${data.data.map(app => createApplicationCard(app)).join('')}
          </div>
        </div>
      `;
      container.innerHTML += applicationsHTML;
    } else {
      const noAppsHTML = `
        <div class="applications-section">
          <h2>Mes Candidatures</h2>
          <div class="no-applications">
            <p>Vous n'avez pas encore postulé à des offres.</p>
            <a href="/jobs" class="btn-primary">Voir les offres</a>
          </div>
        </div>
      `;
      container.innerHTML += noAppsHTML;
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

async function loadAdminPanel() {
  const container = document.getElementById('dashboardContent');
  
  const adminHTML = `
    <div class="admin-panel flex-col gap-1">
      <h2 class="padding-1 w-full radius-1">Administration</h2>
      
      <div class="admin-tabs">
        <button class="tab-button active" data-table="users">Utilisateurs</button>
        <button class="tab-button" data-table="companies">Entreprises</button>
        <button class="tab-button" data-table="jobs">Offres</button>
        <button class="tab-button" data-table="applications">Candidatures</button>
      </div>
      
      <div class="admin-content">
        <div id="adminTableContainer"></div>
      </div>
    </div>
  `;
  
  container.innerHTML = adminHTML;
  
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      loadTable(e.target.dataset.table);
    });
  });
  
  loadTable('users');
}

async function loadTable(tableName) {
  const container = document.getElementById('adminTableContainer');
  container.innerHTML = '<p>Chargement...</p>';
  
  const endpoints = {
    users: '/api/users',
    companies: '/api/companies',
    jobs: '/api/jobs',
    applications: '/api/applications'
  };
  
  try {
    const response = await fetch(endpoints[tableName], {
      credentials: 'include'
    });
    const data = await response.json();
    
    if (data.success && data.data.length > 0) {
      container.innerHTML = createSimpleTable(tableName, data.data);
    } else {
      container.innerHTML = '<p>Aucune donnée disponible</p>';
    }
  } catch (error) {
    container.innerHTML = '<p>Erreur lors du chargement</p>';
  }
}

function createSimpleTable(tableName, records) {
  const headers = {
    users: ['ID', 'Prénom', 'Nom', 'Email', 'Rôle'],
    companies: ['ID', 'Nom', 'Adresse', 'Ville'],
    jobs: ['ID', 'Titre', 'Entreprise', 'Lieu', 'Salaire'],
    applications: ['ID', 'Utilisateur', 'Offre', 'Statut', 'Date']
  };
  
  const rows = records.map(record => {
    switch(tableName) {
      case 'users':
        return `
          <tr>
            <td>${record.id}</td>
            <td>${record.first_name}</td>
            <td>${record.last_name}</td>
            <td>${record.email}</td>
            <td>${record.role}</td>
          </tr>
        `;
      case 'companies':
        return `
          <tr>
            <td>${record.id}</td>
            <td>${record.name}</td>
            <td>${record.address || 'N/A'}</td>
            <td>${record.city || 'N/A'}</td>
          </tr>
        `;
      case 'jobs':
        return `
          <tr>
            <td>${record.id}</td>
            <td>${record.title}</td>
            <td>${record.company_name || 'N/A'}</td>
            <td>${record.location || 'N/A'}</td>
            <td>${record.salary ? record.salary + '€' : 'N/A'}</td>
          </tr>
        `;
      case 'applications':
        return `
          <tr>
            <td>${record.id}</td>
            <td>${record.first_name || 'N/A'} ${record.last_name || ''}</td>
            <td>${record.job_title || 'N/A'}</td>
            <td>${record.status}</td>
            <td>${formatDate(record.created_at)}</td>
          </tr>
        `;
      default:
        return '';
    }
  }).join('');
  
  return `
    <div class="table-container">
      <div class="table-header">
        <h3>Gestion des ${getTableDisplayName(tableName)}s</h3>
        <p class="table-info">Mode lecture seule</p>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            ${headers[tableName].map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function createApplicationCard(application) {
  return `
    <div class="application-card">
      <div class="application-header">
        <h3>${application.job_title}</h3>
      </div>
      <div class="application-details">
        <p><strong>Entreprise :</strong> ${application.company_name}</p>
        <p><strong>Lieu :</strong> ${application.location || 'Non spécifié'}</p>
        ${application.salary ? `<p><strong>Salaire :</strong> ${application.salary}€</p>` : ''}
        <p><strong>Postulé le :</strong> ${formatDate(application.created_at)}</p>
      </div>
      ${application.message ? `<div class="application-message"><strong>Message :</strong> ${application.message}</div>` : ''}
    </div>
  `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ================= DASHBOARD ADMIN SIMPLIFIÉ (READ ONLY) =================

function getTableDisplayName(tableName) {
  const names = {
    users: 'utilisateurs',
    companies: 'entreprises',
    jobs: 'offres d\'emploi',
    applications: 'candidatures'
  };
  return names[tableName] || 'éléments';
}

document.addEventListener('DOMContentLoaded', async () => {
  initDashboard();
  
  if (isAdmin) {
    await loadAdminPanel();
  } else {
    await loadUserProfile();
    await loadUserApplications();
  }
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});