const Employee = require('../models/employee')
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
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
}
exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
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
}
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
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
    })}
}
exports.deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
        return res.status(404).json({
            success: false,
            message: "Employee not found",
        });
        }
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
    }
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
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
}
// Statistiques salariales (moyen, min, max)
exports.getSalaryStatistics = async (req, res) => {
  try {
    const result = await Employee.aggregate([
      {
        $group: {
          _id: null,
          avgSalary: { $avg: "$salary" },
          minSalary: { $min: "$salary" },
          maxSalary: { $max: "$salary" }
        }
      }
    ]);

    const stats = result[0] || {
      avgSalary: 0,
      minSalary: 0,
      maxSalary: 0
    };
    
    res.status(200).json({
      success: true,
      data: {
        averageSalary: Number(stats.avgSalary.toFixed(2)),
        minSalary: stats.minSalary,
        maxSalary: stats.maxSalary
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Nombre d'employés par statut
exports.getEmployeesByStatus = async (req, res) => {
  try {
    const result = await Employee.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Formatage des résultats
    const statusCount = {};
    result.forEach(item => {
      statusCount[item._id] = item.count;
    });
    
    // Valeurs par défaut pour les statuts manquants
    const statuses = ['active', 'on_leave', 'terminated'];
    statuses.forEach(status => {
      if (!statusCount[status]) statusCount[status] = 0;
    });

    res.status(200).json({
      success: true,
      data: statusCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};
// Comptage des employés par département
exports.countEmployeesByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
    
        // Validation du département
        const validDepartments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
        if (!validDepartments.includes(department)) {
        return res.status(400).json({
            success: false,
            message: "Invalid department",
        });
        }
    
        // Comptage des employés par département
        const count = await Employee.countDocuments({ department });
    
        res.status(200).json({
        success: true,
        department,
        count,
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
        });
    }
    }