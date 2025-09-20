const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post(
  '/',
  employeeController.upload.single('profileImage'),
  employeeController.createEmployee
);

router.put(
  '/:id',
  employeeController.upload.single('profileImage'),
  employeeController.updateEmployee
);

router.get('/', employeeController.getEmployees);
router.get('/department/:id', employeeController.getEmployeeByDepartmentId); // placé avant
router.get('/:id', employeeController.getEmployeeByUserId);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
