const mongoose = require('mongoose');
const { Schema } = mongoose;  
const departementSchema = new mongoose.Schema({
    dep_name: { type: String, required: true },
    description: { type: String, required: true },
    employeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
// Référence aux salaires
  salaries: [{ type: Schema.Types.ObjectId, ref: "Salary" }]
}, { timestamps: true });

const Department = mongoose.model('Department', departementSchema);
module.exports = Department;
