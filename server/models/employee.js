const { Schema } = require("mongoose");
const User = require("./user"); // ton modèle User

const employeeSchema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  gender: { type: String },
  dob: { type: Date },
  designation: { type: String },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  // Référence aux salaires
  salaries: [{ type: Schema.Types.ObjectId, ref: "Salary" }],
  salary: { type: Number, min: 0 }, // Bien replacé à l’intérieur
  maritalStatus: { type: String }
});

const Employee = User.discriminator("Employee", employeeSchema);
module.exports = Employee;
