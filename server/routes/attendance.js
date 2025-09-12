const express=require('express');
const router=express.Router();
const {getAttendanceByEmployee,deleteAttendance,recordAttendance }=require('../controllers/attendanceController');
router.post('/',recordAttendance);
router.get('/employee/:employeeId',getAttendanceByEmployee);
router.delete('/:id',deleteAttendance);
module.exports=router;