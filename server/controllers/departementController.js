const Department = require('../models/departement');

// Correction : utiliser ':' au lieu de '=' pour les méthodes d'objet
module.exports = {
  addDepartement: async (req, res) => {
    const { dep_name, description } = req.body;

    if (!dep_name || !description) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
      const newDepartment = new Department({ dep_name, description });
      await newDepartment.save();
      res.status(201).json({ success: true, message: 'Département ajouté avec succès' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du département:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
};