import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import DefaultDashboard from "./pages/DefaultDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import AdminSummary from "./components/AdminSummary";
import DepartementList from "./components/departemt/DepartementList";
import AddDepartment from "./components/departemt/AddDepartement";
import EditDepartment from "./components/EditDepartment";
import EmployeeList from "./components/employee/employeeList";
import EmployeeAdd from "./components/Employee/EmployeeAdd";
import EditEmployee from "./components/Employee/EditEmployee";
import ViewEmployee from "./components/Employee/ViewEmployee";
import Salary from "./components/Salary/Salary";
import Leave from "./components/leave/Leave";
import EmployeeProfile from "./EmployeeDashboard/EmployeeProfile";
import EmployeeLeaves from "./EmployeeDashboard/EmployeeLeaves";
import EmployeeSettings from "./EmployeeDashboard/EmployeeSettings";
import EmployeeSalary from "./EmployeeDashboard/EmployeeSalary";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="departements" element={<DepartementList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="edit-department/:id" element={<EditDepartment />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="add-employee" element={<EmployeeAdd />} />
          <Route path="edit-employee/:id" element={<EditEmployee />} />
          <Route path="view-employee/:id" element={<ViewEmployee/>} />
          <Route path="employee-salary/:id" element={<EmployeeSalary/>} />
          <Route path="salary" element={<Salary/>} />
          <Route path="leave" element={<Leave/>} />
        </Route>

        {/* Employee Dashboard Routes */}
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeProfile />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="leaves" element={<EmployeeLeaves/>} />
          <Route path="salary" element={<EmployeeSalary/>} />
          <Route path="settings" element={<EmployeeSettings />} />
        </Route>

        <Route
          path="/default-dashboard"
          element={
            <ProtectedRoute allowedRoles={["default"]}>
              <DefaultDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}