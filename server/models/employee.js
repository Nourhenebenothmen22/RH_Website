const User = require('../models/user');
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  hireDate: { type: Date, default: Date.now },
  salary: { type: Number, min: 0 },
  status: {
    type: String,
    enum: ['active', 'on_leave', 'terminated'],
    default: 'active'
  },
  // Ajout du champ department
  department: {
    type: String,
    required: true,
    enum: ['IT', 'HR', 'Finance', 'Marketing', 'Operations'] // Exemples de départements
  }
});

User.discriminator('Employee', employeeSchema);
module.exports = mongoose.model('Employee');