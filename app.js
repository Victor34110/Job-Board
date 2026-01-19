require('./config/db');
const express = require('express');
const path = require('path');
const app = express();

require('./middleware')(app);
app.use('/', require('./routes'));

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'error404.html'));
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).sendFile(path.join(__dirname, 'public', 'error404.html'));
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Gérer les erreurs non attrapées
process.on('uncaughtException', (err) => {
  console.error('Erreur non attrapée:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
  process.exit(1);
});
