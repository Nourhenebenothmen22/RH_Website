const { Schema } = require("mongoose");
const User = require("./user"); // ton modèle User

const employeeSchema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  gender: { type: String },
  dob: { type: Date },
  designation: { type: String },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  salary: { type: Number, min: 0 },
  maritalStatus: { type: String }
});

const Employee = User.discriminator("Employee", employeeSchema);
module.exports = Employee;
