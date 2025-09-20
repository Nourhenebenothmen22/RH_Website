const Department = require('../models/departement');
const Employee = require('../models/employee');
const multer = require('multer');
const Path = require('path');
const fs = require('fs');

// Configuration de multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'public/uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + Path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Créer un employé
exports.createEmployee = async (req, res) => {
  try {
    let profileImagePath = "";
    if (req.file) {
      profileImagePath = `/uploads/${req.file.filename}`;
    }

    const employeeData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profileImage: profileImagePath,
      employeeId: req.body.employeeId,
      gender: req.body.gender,
      dob: req.body.dob,
      designation: req.body.designation,
      department: req.body.department,
      salary: req.body.salary,
      maritalStatus: req.body.maritalStatus,
      itemtype: req.body.itemtype || 'Employee'
    };

    const newEmployee = new Employee(employeeData);
    await newEmployee.save();

    // Lier l'employé à son département
    if (newEmployee.department) {
      await Department.findByIdAndUpdate(
        newEmployee.department,
        { $push: { employeeIds: newEmployee._id } },
        { new: true }
      );
    }

    const employeeResponse = newEmployee.toObject();
    delete employeeResponse.password;

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employeeResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Mettre à jour un employé
exports.updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { department: newDepartment } = req.body;

    // Si un fichier est uploadé, ajouter son chemin aux données
    if (req.file) {
      req.body.profileImage = `/public/uploads/${req.file.filename}`;
    }

    const oldEmployee = await Employee.findById(employeeId);

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Si changement de département → retirer de l'ancien + ajouter au nouveau
    if (oldEmployee.department && oldEmployee.department.toString() !== newDepartment) {
      await Department.findByIdAndUpdate(
        oldEmployee.department,
        { $pull: { employeeIds: employeeId } }
      );
    }

    if (newDepartment) {
      await Department.findByIdAndUpdate(
        newDepartment,
        { $addToSet: { employeeIds: employeeId } }
      );
    }

    res.status(200).json({
      success: true,
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Supprimer un employé
exports.deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Retirer du département
    if (employee.department) {
      await Department.findByIdAndUpdate(
        employee.department,
        { $pull: { employeeIds: employeeId } }
      );
    }

    await Employee.findByIdAndDelete(employeeId);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Récupérer tous les employés
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find() .populate("department", "dep_name description") .populate("salaries")
      .populate("projects")
      .populate("attendances");

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Récupérer un employé par ID
exports.getEmployeeByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Recherche de l'employé avec user ID:", id);
    
    const employee = await Employee.findOne({ _id: id })
      .populate("department", "dep_name description")
      .populate("salaries")
      .populate("projects")
      .populate("attendances");

    if (!employee) {
      console.log("❌ Aucun employé trouvé avec user ID:", id);
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    console.log("✅ Employé trouvé:", employee.name);
    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("❌ Erreur dans getEmployeeByUserId:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getEmployeeByDepartmentId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching employees for department:", id);
    
    const employees = await Employee.find({ department: id })
      .populate("department", "dep_name description");
    
    console.log("Found employees:", employees);
    
    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Error in getEmployeeByDepartmentId:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.upload=upload