const JobAdvertisement = require('../models/JobAdvertisement');

const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobAdvertisement.findAllWithCompany();
    res.json({
      success: true,
      data: jobs,
      count: jobs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des offres',
      error: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await JobAdvertisement.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Offre non trouvée'
      });
    }
    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'offre',
      error: error.message
    });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, description, company_id, location, salary } = req.body;

    if (!title || !company_id) {
      return res.status(400).json({
        success: false,
        message: 'Le titre et l\'entreprise sont obligatoires'
      });
    }

    const newJob = await JobAdvertisement.create({
      title,
      description: description || '',
      company_id,
      location: location || '',
      salary: salary || null
    });

    res.status(201).json({
      success: true,
      message: 'Offre créée avec succès',
      data: newJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'offre',
      error: error.message
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await JobAdvertisement.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Offre non trouvée'
      });
    }

    const updatedJob = await JobAdvertisement.update(id, updates);

    res.json({
      success: true,
      message: 'Offre modifiée avec succès',
      data: updatedJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de l\'offre',
      error: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobAdvertisement.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Offre non trouvée'
      });
    }

    await JobAdvertisement.delete(id);

    res.json({
      success: true,
      message: 'Offre supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'offre',
      error: error.message
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};