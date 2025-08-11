const User = require('../models/user');
const mongoose = require('mongoose');
const adminSchema= new mongoose.Schema({
     permissionLevel: {
    type: String,
    enum: ['super_admin', 'hr_admin', 'department_manager'],
    default: 'hr_admin'
  },
})
User.discriminator('Admin',adminSchema)
module.exports = mongoose.model('Admin');