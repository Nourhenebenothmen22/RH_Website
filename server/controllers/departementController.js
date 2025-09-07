const Department = require("../models/departement");

module.exports = {
  addDepartement: async (req, res) => {
    const { dep_name, description } = req.body;

    if (!dep_name || !description) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
      const newDepartment = new Department({ dep_name, description });
      await newDepartment.save();
      res.status(201).json({
        success: true,
        message: "Département ajouté avec succès",
        data: newDepartment,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du département:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
  
  getAllDepartements: async (req, res) => {
    try {
      const departments = await Department.find().populate("employeeIds");
      res.status(200).json({ success: true, departments });
    } catch (error) {
      console.error("Erreur lors de la récupération des départements:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
  
  getDepartementById: async (req, res) => {
    const { id } = req.params;
    try {
      const department = await Department.findById(id).populate("employeeIds");
      if (!department) {
        return res.status(404).json({ error: "Département non trouvé" });
      }
      res.status(200).json({ success: true, department });
    } catch (error) {
      console.error("Erreur lors de la récupération du département:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
  
  updatedDepartment: async (req, res) => {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    try {
      const updatedDepartment = await Department.findByIdAndUpdate(
        id,
        { dep_name, description },
        { new: true, runValidators: true }
      );
      if (!updatedDepartment) {
        return res.status(404).json({ error: "Département non trouvé" });
      }
      res.status(200).json({ 
        success: true, 
        message: "Département mis à jour avec succès", 
        data: updatedDepartment 
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du département:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
  
  deleteDepartment: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedDepartment = await Department.findByIdAndDelete(id);
      if (!deletedDepartment) {
        return res.status(404).json({ error: "Département non trouvé" });
      }
      res.status(200).json({ 
        success: true, 
        message: "Département supprimé avec succès" 
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du département:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
};