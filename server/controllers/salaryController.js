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