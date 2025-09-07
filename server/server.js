// server.js
// ========================
// 1. Imports & Configuration
// ========================
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path'); // Ajout de path pour gérer les chemins
const connectDB = require('./config/db');

// ========================
// 2. Initialisation de l'application
// ========================
const app = express();
const port = process.env.PORT || 5000;

// ========================
// 3. Middlewares globaux
// ========================
 app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));
    
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(morgan('dev'));
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    }));
    
    // Servir les fichiers statiques
    app.use('/public', express.static(path.join(__dirname, 'public')));


// ========================
// 4. Routes
// ========================
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
const adminRouter= require('./routes/admin');
app.use('/api/admin', adminRouter);
const employeeRouter = require('./routes/employee');
app.use('/api/employee', employeeRouter);
const departmentRouter = require('./routes/departement');
app.use('/api/department', departmentRouter);

// ========================
// 5. Connexion DB & Lancement serveur
// ========================
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur lors de la connexion à la base de données :', err);
    process.exit(1); // Arrêter le serveur en cas d'échec
  });
