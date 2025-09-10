const { Schema } = require("mongoose");
const User = require("./user"); // your User model

const employeeSchema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  gender: { type: String },
  dob: { type: Date },
  designation: { type: String },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  // Reference to salaries
  salaries: [{ type: Schema.Types.ObjectId, ref: "Salary" }],
  salary: { type: Number, min: 0 },
  maritalStatus: { type: String }
});

const Employee = User.discriminator("Employee", employeeSchema);
module.exports = Employee;