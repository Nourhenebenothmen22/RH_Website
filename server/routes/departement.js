const express = require('express');
const router = express.Router();
const departementController = require('../controllers/departementController');

router.post('/', departementController.addDepartement);

module.exports = router;