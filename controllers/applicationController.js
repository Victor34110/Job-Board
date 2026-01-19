const JobApplication = require('../models/JobApplication');

const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll();
    res.json({
      success: true,
      data: applications,
      count: applications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des candidatures',
      error: error.message
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée'
      });
    }
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la candidature',
      error: error.message
    });
  }
};

const createApplication = async (req, res) => {
  try {
    const { user_id, advertisement_id, message } = req.body;

    if (!user_id || !advertisement_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id et advertisement_id sont obligatoires'
      });
    }

    // Convertir en entiers pour éviter les erreurs de type
    const userId = parseInt(user_id);
    const advertisementId = parseInt(advertisement_id);

    if (isNaN(userId) || isNaN(advertisementId)) {
      return res.status(400).json({
        success: false,
        message: 'user_id et advertisement_id doivent être des nombres valides'
      });
    }

    const newApplication = await JobApplication.create({
      user_id: userId,
      advertisement_id: advertisementId,
      message: message || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Candidature créée avec succès',
      data: newApplication
    });
  } catch (error) {
    console.error('Erreur création candidature:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la candidature',
      error: error.message
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée'
      });
    }

    const updatedApplication = await JobApplication.update(id, updates);

    res.json({
      success: true,
      message: 'Candidature modifiée avec succès',
      data: updatedApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de la candidature',
      error: error.message
    });
  }
};

const getApplicationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await JobApplication.findByUser(userId);
    res.json({
      success: true,
      data: applications,
      count: applications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des candidatures de l\'utilisateur',
      error: error.message
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée'
      });
    }

    await JobApplication.delete(id);

    res.json({
      success: true,
      message: 'Candidature supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la candidature',
      error: error.message
    });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  getApplicationsByUser,
  createApplication,
  updateApplication,
  deleteApplication
};