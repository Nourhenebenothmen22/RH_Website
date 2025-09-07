// controllers/employeeController.js
const Department = require('../models/departement');
const Employee = require('../models/employee');

// Créer un employé
exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();

    // Ajouter l'employé dans son département
    if (newEmployee.department) {
      await Department.findByIdAndUpdate(
        newEmployee.department,
        { $push: { employeeIds: newEmployee._id } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      data: newEmployee,
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

    // Ancien employé avant modif
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
    const employees = await Employee.find()
      .populate("department", "dep_name description"); // ramène nom + description du département

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
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department", "dep_name description");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
