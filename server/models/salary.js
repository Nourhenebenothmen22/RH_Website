const mongoose = require("mongoose");
const { Schema } = mongoose;

const salarySchema = new Schema({
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  payDate: { type: Date, required: true },
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Salary", salarySchema);
