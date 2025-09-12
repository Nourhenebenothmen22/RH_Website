const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employee", 
    required: true 
  }, // référence à l'employé
  date: { 
    type: Date, 
    required: true 
  }, // date de l'enregistrement
  checkIn: { 
    type: String 
  }, // heure d'arrivée (format "HH:MM")
  checkOut: { 
    type: String 
  }, // heure de départ (format "HH:MM")
  status: { 
    type: String, 
    enum: ["present", "absent", "late", "onLeave"], 
    required: true 
  }, // statut de la journée
  workHours: { 
    type: Number, 
    default: 0 
  }, // nombre d'heures travaillées calculé
  notes: { 
    type: String 
  }, // remarques ou commentaires
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});
module.exports = mongoose.model("Attendance", attendanceSchema);
