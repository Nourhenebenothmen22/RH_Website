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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route
            path="departements"
            element={<DepartementList />} // Déplacement ici
          />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="edit-department/:id" element={<EditDepartment />} />

        </Route>

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

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
