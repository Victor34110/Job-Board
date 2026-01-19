const express = require('express');
const router = express.Router();
const jobController = require('../../controllers/jobController');
const { authenticate, isAdmin } = require('../../middleware');

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', authenticate, isAdmin, jobController.createJob);
router.put('/:id', authenticate, isAdmin, jobController.updateJob);
router.delete('/:id', authenticate, isAdmin, jobController.deleteJob);

module.exports = router;