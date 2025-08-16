const mongoose = require('mongoose');

const departementSchema = new mongoose.Schema({
    dep_name: { type: String, required: true },
    description: { type: String, required: true },
});

const Department = mongoose.model('Department', departementSchema);
module.exports = Department; // Export CommonJS