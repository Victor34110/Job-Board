const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/landing.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/jobs', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/jobs.html'));
});

router.get('/companies', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/companies.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

module.exports = router;
