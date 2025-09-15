const Attendance = require('../models/Attendance');
const Employee = require('../models/employee');

// Enregistrer la présence d'un employé
exports.recordAttendance = async (req, res) => {
    try {
        const { date, checkIn, checkOut, status, notes, employee } = req.body;

        if (!date || !status || !employee || !checkIn || !checkOut) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const attendanceRecord = new Attendance({
            employee,
            date,
            checkIn,
            checkOut,
            status,
            notes
        });

        await attendanceRecord.save();

        // Ajouter la référence de présence à l'employé
        await Employee.findByIdAndUpdate(
            employee,
            { $push: { attendances: attendanceRecord._id } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Attendance recorded successfully",
            data: attendanceRecord
        });
    } catch (error) {
        console.error("Error while recording attendance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAttendanceByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const attendanceRecords = await Attendance.find({ employee: employeeId }).populate('employee', 'name email');
        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const attendanceRecord = await Attendance.findByIdAndDelete(id);
        if (!attendanceRecord) {
            return res.status(404).json({ error: "Attendance record not found" });
        }
        // Remove attendance reference from employee
        await Employee.findByIdAndUpdate(
            attendanceRecord.employee,
            { $pull: { attendances: id } }
        );
        res.status(200).json({ success: true, message: "Attendance record deleted successfully" });
    } catch (error) {
        console.error("Error deleting attendance record:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

