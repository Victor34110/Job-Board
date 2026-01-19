const Company = require('../models/Company');

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json({
      success: true,
      data: companies,
      count: companies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des entreprises',
      error: error.message
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Entreprise non trouvée'
      });
    }
    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'entreprise',
      error: error.message
    });
  }
};

const createCompany = async (req, res) => {
  try {
    const { name, address, city } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de l\'entreprise est obligatoire'
      });
    }

    const newCompany = await Company.create({
      name,
      address: address || '',
      city: city || ''
    });

    res.status(201).json({
      success: true,
      message: 'Entreprise créée avec succès',
      data: newCompany
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'entreprise',
      error: error.message
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Entreprise non trouvée'
      });
    }

    const updatedCompany = await Company.update(id, updates);

    res.json({
      success: true,
      message: 'Entreprise modifiée avec succès',
      data: updatedCompany
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de l\'entreprise',
      error: error.message
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Entreprise non trouvée'
      });
    }

    await Company.delete(id);

    res.json({
      success: true,
      message: 'Entreprise supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'entreprise',
      error: error.message
    });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};