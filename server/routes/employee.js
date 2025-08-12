const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Routes CRUD existantes
router.get('/', employeeController.getEmployees);
router.post('/', employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// Nouvelle route pour le comptage par département (existante)
router.get('/department/:department', employeeController.countEmployeesByDepartment);

// Nouvelles routes pour les statistiques
router.get('/stats/salary', employeeController.getSalaryStatistics);
router.get('/stats/status', employeeController.getEmployeesByStatus);

module.exports = router;