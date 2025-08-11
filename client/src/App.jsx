import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import DefaultDashboard from './pages/DefaultDashboard';


export default function App() {
  return (
   <BrowserRouter>
     <Routes>
         <Route path="/" element={<Navigate to="admin-dashboard" />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
          <Route path="/employee-dashboard" element={<EmployeeDashboard />}></Route>
          <Route path="/default-dashboard" element={<DefaultDashboard />}></Route>

          {/* Add more routes as needed */}

     </Routes>
   </BrowserRouter>
  );
}
