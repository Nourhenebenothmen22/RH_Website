const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
});
module.exports = mongoose.model('Project', projectSchema);