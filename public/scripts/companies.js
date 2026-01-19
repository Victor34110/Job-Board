// public/scripts/companies.js

/**
 * Crée l'HTML d'une entreprise
 */
function createCompanyElement(company) {
  const companyElement = document.createElement('div');
  companyElement.className = 'job-item flex-col radius-1 padding-1 gap-1';
  companyElement.setAttribute('data-company-id', company.id);
  
  companyElement.innerHTML = `
    <div class="job-header flex-col gap-1">
      <h2 class="job-title">${company.name}</h2>
      <div class="job-company">
        <span class="company-location">${company.city || 'Lieu non spécifié'}</span>
      </div>
    </div>
    <div class="job-content flex-col gap-1">
      <div class="job-details">
        <span class="company-address">${company.address || 'Adresse non spécifiée'}</span>
      </div>
    </div>
  `;
  
  return companyElement;
}

// Initialiser la page
initPage({
  apiUrl: '/api/companies',
  listElementId: 'jobsList',
  createElementFn: createCompanyElement,
  messages: {
    noResults: "Aucune entreprise disponible",
    error: "Erreur lors du chargement des entreprises"
  }
});
