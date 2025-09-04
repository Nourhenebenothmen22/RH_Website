const express = require('express');
const router = express.Router();
const departementController = require('../controllers/departementController');

router.post('/', departementController.addDepartement);
router.get('/', departementController.getAllDepartements);

module.exports = router;