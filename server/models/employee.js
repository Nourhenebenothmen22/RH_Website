const User = require('../models/user');
const mongoose = require('mongoose');
const employeeSchema= new mongoose.Schema({
 hireDate: { type: Date, default: Date.now },
 salary: { type: Number, min: 0 },
  status: {
    type: String,
    enum: ['active', 'on_leave', 'terminated'],
    default: 'active'
  },
})
User.discriminator('Employee',adminSchema)
module.exports = mongoose.model('Employee');