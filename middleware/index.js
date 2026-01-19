const express = require('express');
const path = require('path');
const session = require('express-session');

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '../public')));
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'simple-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
  }));
};

// Middleware d'authentification
const authenticate = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({
    success: false,
    message: 'Accès non autorisé'
  });
};

// Middleware pour vérifier le rôle admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    return next();
  }
  res.status(403).json({
    success: false,
    message: 'Accès refusé - Droits administrateur requis'
  });
};

module.exports.authenticate = authenticate;
module.exports.isAdmin = isAdmin;
