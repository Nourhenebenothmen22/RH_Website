const express = require('express');
const router = express.Router();
const { userRegister,userLogin, validateToken } = require('../controllers/authController');
const { verifyToken, verifyTokenAdmin } = require('../Middlewares/authMiddleware');
router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/validate',verifyToken,verifyTokenAdmin,validateToken)
module.exports = router;