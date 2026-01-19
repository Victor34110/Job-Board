const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));

router.use('/jobs', require('./jobs'));

router.use('/companies', require('./companies'));

router.use('/applications', require('./applications'));

router.use('/users', require('./users'));

module.exports = router;
