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
        <div>
          <h3>Gestion des ${getTableDisplayName(tableName)}s</h3>
          <button class="btn-primary" onclick="openCreateModal('${tableName}')">+ Ajouter</button>
        </div>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            ${headers[tableName].map(h => `<th>${h}</th>`).join('')}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${records.map((record, idx) => {
            let row = '';
            switch(tableName) {
              case 'users':
                row = `
                  <tr>
                    <td>${record.id}</td>
                    <td>${record.first_name}</td>
                    <td>${record.last_name}</td>
                    <td>${record.email}</td>
                    <td>${record.role}</td>
                    <td>
                      <button class="btn-small" onclick="openEditModal('users', ${record.id})">Éditer</button>
                      <button class="btn-small btn-danger" onclick="deleteRecord('users', ${record.id})">Supprimer</button>
                    </td>
                  </tr>
                `;
                break;
              case 'companies':
                row = `
                  <tr>
                    <td>${record.id}</td>
                    <td>${record.name}</td>
                    <td>${record.address || 'N/A'}</td>
                    <td>${record.city || 'N/A'}</td>
                    <td>
                      <button class="btn-small" onclick="openEditModal('companies', ${record.id})">Éditer</button>
                      <button class="btn-small btn-danger" onclick="deleteRecord('companies', ${record.id})">Supprimer</button>
                    </td>
                  </tr>
                `;
                break;
              case 'jobs':
                row = `
                  <tr>
                    <td>${record.id}</td>
                    <td>${record.title}</td>
                    <td>${record.company_name || 'N/A'}</td>
                    <td>${record.location || 'N/A'}</td>
                    <td>${record.salary ? record.salary + '€' : 'N/A'}</td>
                    <td>
                      <button class="btn-small" onclick="openEditModal('jobs', ${record.id})">Éditer</button>
                      <button class="btn-small btn-danger" onclick="deleteRecord('jobs', ${record.id})">Supprimer</button>
                    </td>
                  </tr>
                `;
                break;
              case 'applications':
                row = `
                  <tr>
                    <td>${record.id}</td>
                    <td>${record.first_name || 'N/A'} ${record.last_name || ''}</td>
                    <td>${record.job_title || 'N/A'}</td>
                    <td>${record.status}</td>
                    <td>${formatDate(record.created_at)}</td>
                    <td>
                      <button class="btn-small btn-danger" onclick="deleteRecord('applications', ${record.id})">Supprimer</button>
                    </td>
                  </tr>
                `;
                break;
            }
            return row;
          }).join('')}
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

// ================= FONCTIONS CRUD =================

async function deleteRecord(tableName, recordId) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
    return;
  }
  
  const endpoints = {
    users: `/api/users/${recordId}`,
    companies: `/api/companies/${recordId}`,
    jobs: `/api/jobs/${recordId}`,
    applications: `/api/applications/${recordId}`
  };
  
  try {
    const response = await fetch(endpoints[tableName], {
      method: 'DELETE',
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      showNotification('Élément supprimé avec succès', 'success');
      loadTable(tableName);
    } else {
      showNotification(data.message || 'Erreur lors de la suppression', 'error');
    }
  } catch (error) {
    showNotification('Erreur de connexion', 'error');
    console.error(error);
  }
}

function openCreateModal(tableName) {
  let formHTML = '';
  
  switch(tableName) {
    case 'companies':
      formHTML = `
        <input type="text" id="companyName" placeholder="Nom" required>
        <input type="text" id="companyAddress" placeholder="Adresse" required>
        <input type="text" id="companyCity" placeholder="Ville" required>
      `;
      break;
    case 'jobs':
      formHTML = `
        <input type="text" id="jobTitle" placeholder="Titre" required>
        <input type="number" id="jobCompanyId" placeholder="ID Entreprise" required>
        <input type="text" id="jobLocation" placeholder="Lieu" required>
        <input type="number" id="jobSalary" placeholder="Salaire" required>
        <textarea id="jobDescription" placeholder="Description" required></textarea>
      `;
      break;
    case 'users':
      formHTML = `
        <input type="text" id="firstName" placeholder="Prénom" required>
        <input type="text" id="lastName" placeholder="Nom" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Mot de passe" required>
        <select id="role" required>
          <option value="user">Utilisateur</option>
          <option value="admin">Admin</option>
        </select>
      `;
      break;
  }
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Ajouter un nouvel élément</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <div class="modal-body">
        ${formHTML}
      </div>
      <div class="modal-footer">
        <button class="btn-primary" onclick="createRecord('${tableName}', this.closest('.modal'))">Créer</button>
        <button class="btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

async function createRecord(tableName, modal) {
  const data = {};
  
  switch(tableName) {
    case 'companies':
      data.name = document.getElementById('companyName').value;
      data.address = document.getElementById('companyAddress').value;
      data.city = document.getElementById('companyCity').value;
      break;
    case 'jobs':
      data.title = document.getElementById('jobTitle').value;
      data.company_id = document.getElementById('jobCompanyId').value;
      data.location = document.getElementById('jobLocation').value;
      data.salary = document.getElementById('jobSalary').value;
      data.description = document.getElementById('jobDescription').value;
      break;
    case 'users':
      data.first_name = document.getElementById('firstName').value;
      data.last_name = document.getElementById('lastName').value;
      data.email = document.getElementById('email').value;
      data.password = document.getElementById('password').value;
      data.role = document.getElementById('role').value;
      break;
  }
  
  try {
    const response = await fetch(`/api/${tableName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification('Élément créé avec succès', 'success');
      modal.remove();
      loadTable(tableName);
    } else {
      showNotification(result.message || 'Erreur lors de la création', 'error');
    }
  } catch (error) {
    showNotification('Erreur de connexion', 'error');
    console.error(error);
  }
}

function openEditModal(tableName, recordId) {
  alert('Édition en cours de développement. Pour l\'instant, supprimez et recréez.');
}

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