const Salary = require("../models/salary");
const Employee = require("../models/employee");
const Department = require("../models/departement");

// Create a new salary
exports.createSalary = async (req, res) => {
    try {
        const { basicSalary, allowances, deductions, payDate, employee, department } = req.body;
        if (!basicSalary || !payDate || !employee || !department) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const salary = new Salary({
            basicSalary,
            allowances,
            deductions,
            payDate,
            netSalary: basicSalary + (allowances || 0) - (deductions || 0),
            employee,
            department
        });
        await salary.save();
        // Update the salary reference in the employee
        await Employee.findByIdAndUpdate(employee, { $push: { salaries: salary._id } });
        // Update the salary reference in the department
        await Department.findByIdAndUpdate(department, { $push: { salaries: salary._id } });
        res.status(201).json({ success: true, message: "Salary created successfully", data: salary });
    }
    catch (error) {
        console.error("Error while creating salary:", error);
        res.status(500).json({ error: "Internal server error" });
    }

};
// Get all salaries
exports.getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find().populate("employee").populate("department");
        res.status(200).json({ success: true, data: salaries });
    }
    catch (error) {
        console.error("Error while fetching salaries:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Get a salary by ID
exports.getSalaryById = async (req, res) => {
    try {
        const { id } = req.params;
        const salary = await Salary.findById(id).populate("employee").populate("department");
        if (!salary) {
            return res.status(404).json({ error: "Salary not found" });
        }
        res.status(200).json({ success: true, data: salary });
    }
    catch (error) {
        console.error("Error while fetching salary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const Salary = require("../models/salary");

exports.updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSalary = await Salary.findByIdAndUpdate(
      id,
      req.body, // tout ce qui est envoyé dans le body
      { new: true, runValidators: true }
    );

    if (!updatedSalary) {
      return res.status(404).json({ error: "Salary not found" });
    }

    res.status(200).json({
      success: true,
      message: "Salary updated successfully",
      data: updatedSalary
    });
  } catch (error) {
    console.error("Error while updating salary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSalary = await Salary.findByIdAndDelete(id);

    if (!deletedSalary) {
      return res.status(404).json({ error: "Salary not found" });
    }

    // Retirer les références dans Employee et Department
    await Employee.findByIdAndUpdate(deletedSalary.employee, {
      $pull: { salaries: deletedSalary._id }
    });

    await Department.findByIdAndUpdate(deletedSalary.department, {
      $pull: { salaries: deletedSalary._id }
    });

    res.status(200).json({
      success: true,
      message: "Salary deleted successfully"
    });
  } catch (error) {
    console.error("Error while deleting salary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};