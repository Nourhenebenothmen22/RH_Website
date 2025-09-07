const express = require('express');
const router = express.Router();
const{createEmployee,updateEmployee,deleteEmployee,getEmployeeById,getEmployees}=require('../controllers/employeeController');
// Routes CRUD existantes
router.post('/', createEmployee);
router.get('/',getEmployees);
router.get('/:id',getEmployeeById);
router.put('/:id',updateEmployee);
router.delete('/:id',deleteEmployee);
module.exports = router;