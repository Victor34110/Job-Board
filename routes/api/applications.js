const express = require('express');
const router = express.Router();
const applicationController = require('../../controllers/applicationController');
const { authenticate, isAdmin } = require('../../middleware');

router.get('/', authenticate, isAdmin, applicationController.getAllApplications);
router.get('/user/:userId', authenticate, applicationController.getApplicationsByUser);
router.get('/:id', authenticate, isAdmin, applicationController.getApplicationById);
router.post('/', authenticate, applicationController.createApplication);
router.put('/:id', authenticate, isAdmin, applicationController.updateApplication);
router.delete('/:id', authenticate, isAdmin, applicationController.deleteApplication);

module.exports = router;