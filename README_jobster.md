<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-API-black?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/HTML%2FCSS%2FJS-Frontend-orange?style=for-the-badge" />
</p>

<h1 align="center">🚀 JobSter</h1>

<p align="center">
  <b>Plateforme de gestion d'offres d'emploi et de candidatures</b>
</p>

> **Projet réalisé dans le cadre du T-WEB-501 (Pool Web) – Epitech**  
> Premier projet web en équipe, avec un gros focus sur le **design** et l’**expérience utilisateur**.

---

## 🎯 Présentation

JobSter est une application web permettant de :

- 🔎 **Consulter** des offres d’emploi et des entreprises  
- ✍️ **Postuler** à des offres avec un message personnalisé  
- 👤 **Gérer** son profil et ses candidatures  
- 🛠️ **Administrer** la plateforme (espace admin)  

---

## 🎨 Design & UX

Nous avons mis l’accent sur :

- UI moderne et intuitive
- Responsive (mobile / tablette / desktop)
- Animations & transitions fluides
- Palette cohérente
- Typographies personnalisées (**Satoshi**, **Lobster**)

---

## 🛠 Technologies

### Backend
- Node.js
- Express.js
- PostgreSQL
- bcryptjs
- express-session
- dotenv

### Frontend
- HTML5 / CSS3
- JavaScript (Vanilla)
- Fetch API

---

## ✨ Fonctionnalités

### Utilisateurs (public)
- ✅ Accès aux offres / entreprises
- ✅ Inscription & connexion

### Utilisateurs connectés
- ✅ Gestion du profil
- ✅ Postuler à une offre
- ✅ Suivi des candidatures (pending / accepted / rejected)

### Admin
- ✅ Dashboard admin
- ✅ CRUD utilisateurs / entreprises / offres / candidatures
- ✅ Gestion des statuts de candidatures

---

## 📁 Structure du projet

```txt
T-WEB-501-MPL_7/
├── app.js
├── config/
├── controllers/
├── models/
├── routes/
└── public/
```

---

## 🚀 Installation & lancement en local

### ✅ Prérequis
- Node.js (18+ recommandé)
- PostgreSQL
- Git

### 1) Cloner le projet
```bash
git clone https://github.com/Victor34110/Job-Board.git
cd Job-Board
```

### 2) Installer les dépendances
```bash
npm install
```

### 3) Créer la base PostgreSQL
Dans PostgreSQL :

```sql
CREATE DATABASE jobster;
```

### 4) Configurer le fichier `.env`
Créer un fichier **.env** à la racine :

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=jobster
DB_PORT=5432

PORT=3000
SESSION_SECRET=change_me
```

### 5) Lancer le serveur
```bash
npm start
```

✅ Ensuite ouvre : **http://localhost:3000**

---

## 👤 Inscription / Connexion

- Inscription : `http://localhost:3000/register`
- Connexion : `http://localhost:3000/login`

Une fois connecté, tu peux naviguer sur :
- Offres : `/jobs`
- Entreprises : `/companies`
- Dashboard : `/dashboard`
