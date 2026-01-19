
function createJobElement(job) {
  const jobElement = document.createElement('div');
  jobElement.className = 'job-item flex-col radius-1 padding-1 gap-1';
  jobElement.setAttribute('data-job-id', job.id);
  
  jobElement.innerHTML = `
    <div class="job-header flex-col gap-1">
      <h2 class="job-title">${job.title}</h2>
      <div class="job-company">
        <span class="company-name">${job.company_name || 'Entreprise non spécifiée'}</span>
        <span class="company-location">${job.location || 'Lieu non spécifié'}</span>
      </div>
    </div>
    <div class="job-content flex-col gap-1">
      <div class="job-details">
        ${job.salary ? `<span class="job-salary">${job.salary}€</span>` : ''}
        ${job.location ? `<span class="job-location">${job.location}</span>` : ''}
        <span class="job-date">${new Date(job.date_publication).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
    <div class="job-description" style="display: none;">
      <p>${job.description || 'Aucune description disponible'}</p>
    </div>
    <div class="job-actions flex-col w-full gap-1">
      <button class="learn-more-btn" data-job-id="${job.id}">
        En savoir plus
      </button>
      <button class="apply-btn" data-job-id="${job.id}">
        Postuler
      </button>
    </div>
  `;
  
  return jobElement;
}

async function handleApply(jobId) {
  const user = getUser();
  if (!user) {
    window.location.href = '/login';
    return;
  }
  
  const message = prompt('Message de motivation (optionnel) :');
  if (message === null) return;
  
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        user_id: user.id,
        advertisement_id: jobId,
        message: message || ''
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      showNotification('Candidature envoyée avec succès !', 'success');
    } else {
      showNotification(data.message || 'Erreur lors de l\'envoi de la candidature', 'error');
    }
  } catch (error) {
    showNotification('Erreur de connexion au serveur', 'error');
  }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('apply-btn')) {
    const jobId = e.target.getAttribute('data-job-id');
    if (jobId) {
      handleApply(jobId);
    }
  }
});

initPage({
  apiUrl: '/api/jobs',
  listElementId: 'jobsList',
  createElementFn: createJobElement,
  messages: {
    noResults: "Aucune offre d'emploi disponible",
    error: "Erreur lors du chargement des offres d'emploi"
  }
});
