const Employee = require('../models/employee');
const Department = require('../models/departement');
const Salary = require('../models/salary');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private (Admin only)
const getDashboardSummary = async (req, res) => {
  try {
    // 1. Get total employees count
    const totalEmployees = await Employee.countDocuments();

    // 2. Get total departments count
    const totalDepartments = await Department.countDocuments();



    // 4. Calculate total payroll (current month)
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const payrollData = await Salary.aggregate([
      {
        $match: {
          payDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalPayroll: { $sum: "$netSalary" }
        }
      }
    ]);

    const totalPayroll = payrollData.length > 0 ? payrollData[0].totalPayroll : 0;

    // 5. Préparer la réponse
    const summary = {
      totalEmployees,
      totalDepartments,
      totalPayroll,
    };

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données du tableau de bord"
    });
  }
};

module.exports = { getDashboardSummary };
