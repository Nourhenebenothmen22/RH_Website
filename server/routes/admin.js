const express = require('express');
const router = express.Router();
const {
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminById,
    countAdminsByPermission,
    countAllAdminsGrouped
} = require('../controllers/adminController');

// @desc Get all admins
router.get('/', getAdmin);

// @desc Create a new admin
router.post('/', createAdmin);

// @desc Get single admin by ID
router.get('/:id', getAdminById);

// @desc Update admin by ID
router.put('/:id', updateAdmin);

// @desc Delete admin by ID
router.delete('/:id', deleteAdmin);

// @desc Count admins by specific permission level
router.get('/count/permission/:permissionLevel', countAdminsByPermission);

// @desc Count admins grouped by permission level
router.get('/count/grouped/all', countAllAdminsGrouped);

module.exports = router;
