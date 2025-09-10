const express = require('express');
const router = express.Router();
const { getAllSalaries, getSalaryById, createSalary, updateSalary, deleteSalary } = require('../controllers/salaryController');
router.post('/', createSalary);


module.exports = router; 