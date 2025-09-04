const express = require('express');
const router = express.Router();
const departementController = require('../controllers/departementController');

router.post('/', departementController.addDepartement);
router.get('/', departementController.getAllDepartements);
router.get('/:id', departementController.getDepartementById);
router.put('/:id', departementController.updatedDepartment);

module.exports = router;