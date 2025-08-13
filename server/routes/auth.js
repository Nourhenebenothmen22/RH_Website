const express = require('express');
const router = express.Router();
const { userRegister,userLogin, validateToken } = require('../controllers/authController');
const { verifyToken } = require('../Middlewares/authMiddleware');
router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/validate',verifyToken,validateToken)
module.exports = router;