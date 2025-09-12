const { Schema } = require("mongoose");
const User = require("./user"); // your User model

const employeeSchema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  gender: { type: String },
  dob: { type: Date },
  designation: { type: String },
  department: { type: Schema.Types.ObjectId, ref: "Department"},
  // Reference to salaries
  salaries: [{ type: Schema.Types.ObjectId, ref: "Salary" }],
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  salary: { type: Number, min: 0 },
  maritalStatus: { type: String }
});

const Employee = User.discriminator("Employee", employeeSchema);
module.exports = Employee;