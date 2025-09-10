import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBuilding, 
  FaUsers, 
  FaMoneyBillWave, 
  FaCog, 
  FaUserCircle
} from "react-icons/fa";
import { useAuth } from '../hooks/useAuth'; 

function AdminSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  // Vérifie si le tableau de bord est actif en fonction de l'URL
  const isDashboardActive = location.pathname.startsWith('/admin-dashboard') && 
                           !location.pathname.includes('/admin-dashboard/');

  return (
    <div className="fixed top-0 left-0 h-screen z-50 
      bg-gradient-to-br from-blue-500 to-blue-400
      text-white shadow-xl flex flex-col w-64">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-300">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg">
            <span className="text-blue-500 font-bold text-lg">EMS</span>
          </div>
          <h3 className="text-white text-xl font-semibold">Employee MS</h3>
        </div>
      </div>

      {/* Menu */}
      <div className="p-2 mt-2 flex-1 overflow-y-auto">
        <NavLink 
          to="/admin-dashboard" 
          className={({ isActive }) => 
            `flex items-center p-3 my-1 rounded-lg transition-all duration-300
            ${isDashboardActive 
              ? 'bg-blue-100 text-blue-600 shadow-md' 
              : 'text-blue-50 hover:bg-blue-500 hover:bg-opacity-50'}`
          }
        >
          <FaTachometerAlt className="text-lg" />
          <span className="ml-3">Dashboard</span>
        </NavLink>
        
       <NavLink 
  to="departements" // CORRECTION : Chemin relatif
  className={({ isActive }) => 
    `flex items-center p-3 my-1 rounded-lg transition-all duration-300
    ${isActive 
      ? 'bg-blue-100 text-blue-600 shadow-md' 
      : 'text-blue-50 hover:bg-blue-500 hover:bg-opacity-50'}`
  }
>
  <FaBuilding className="text-lg" />
  <span className="ml-3">Départements</span>
</NavLink>
        
        <NavLink 
          to="/admin-dashboard/employees" 
          className={({ isActive }) => 
            `flex items-center p-3 my-1 rounded-lg transition-all duration-300
            ${isActive 
              ? 'bg-blue-100 text-blue-600 shadow-md' 
              : 'text-blue-50 hover:bg-blue-500 hover:bg-opacity-50'}`
          }
        >
          <FaUsers className="text-lg" />
          <span className="ml-3">Employés</span>
        </NavLink>
        
        <NavLink 
          to="/admin-dashboard/Salary" 
          className={({ isActive }) => 
            `flex items-center p-3 my-1 rounded-lg transition-all duration-300
            ${isActive 
              ? 'bg-blue-100 text-blue-600 shadow-md' 
              : 'text-blue-50 hover:bg-blue-500 hover:bg-opacity-50'}`
          }
        >
          <FaMoneyBillWave className="text-lg" />
          <span className="ml-3">Salaires</span>
        </NavLink>
        
        <NavLink 
          to="/admin-dashboard/settings" 
          className={({ isActive }) => 
            `flex items-center p-3 my-1 rounded-lg transition-all duration-300
            ${isActive 
              ? 'bg-blue-100 text-blue-600 shadow-md' 
              : 'text-blue-50 hover:bg-blue-500 hover:bg-opacity-50'}`
          }
        >
          <FaCog className="text-lg" />
          <span className="ml-3">Paramètres</span>
        </NavLink>
      </div>
    </div>
  );
}

export default AdminSidebar;