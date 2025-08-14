import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBuilding, 
  FaUsers, 
  FaMoneyBillWave, 
  FaCog, 
  FaSignOutAlt, 
  FaChevronLeft, 
  FaChevronRight,
  FaUserCircle
} from "react-icons/fa";
import { useAuth } from '../hooks/useAuth'; 

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`fixed top-0 left-0 h-screen z-50 
      bg-gradient-to-br from-blue-700 to-blue-900
      text-white transition-all duration-300 ease-in-out
      shadow-xl flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-400">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg">
              <span className="text-blue-700 font-bold text-lg">EMS</span>
            </div>
            <h3 className="text-white text-xl font-semibold">Employee MS</h3>
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 transition-all duration-300"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Profile */}
      {user && !collapsed && (
        <div className="flex items-center p-4 mx-4 my-3 bg-blue-600 bg-opacity-30 rounded-lg">
          <div className="relative">
            <FaUserCircle className="text-3xl text-blue-200" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-800"></div>
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="font-medium truncate">{user.name || 'Administrateur'}</p>
            <p className="text-sm text-blue-200 truncate">{user.email || 'admin@example.com'}</p>
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="p-2 mt-2 flex-1 overflow-y-auto">
        <NavLink 
          to="/admin-dashboard" 
          className={({ isActive }) => 
            `flex items-center p-3 my-1 rounded-lg transition-all duration-300
            ${isActive 
              ? 'bg-white text-blue-700 shadow-md' 
              : 'text-gray-100 hover:bg-blue-600 hover:bg-opacity-30'}
            ${collapsed ? 'justify-center' : ''}`
          }
        >
          <FaTachometerAlt className="text-lg" />
          {!collapsed && <span className="ml-3">Dashboard</span>}
        </NavLink>
        
        <NavLink 
          to="/departments" 
          className={({ isActive }) => 
            `flex items-center p-3 my-1 rounded-lg transition-all duration-300
            ${isActive 
              ? 'bg-white text-blue-700 shadow-md' 
              : 'text-gray-100 hover:bg-blue-600 hover:bg-opacity-30'}
            ${collapsed ? 'justify-center' : ''}`
          }
        >
          <FaBuilding className="text-lg" />
          {!collapsed && <span className="ml-3">Départements</span>}
        </NavLink>
        
        <NavLink 
          to="/employees" 
          className={({ isActive }) => 
            `flex items-center p-3 my-1 rounded-lg transition-all duration-300
            ${isActive 
              ? 'bg-white text-blue-700 shadow-md' 
              : 'text-gray-100 hover:bg-blue-600 hover:bg-opacity-30'}
            ${collapsed ? 'justify-center' : ''}`
          }
        >
          <FaUsers className="text-lg" />
          {!collapsed && <span className="ml-3">Employés</span>}
        </NavLink>
        
        <NavLink 
          to="/salaries" 
          className={({ isActive }) => 
            `flex items-center p-3 my-1 rounded-lg transition-all duration-300
            ${isActive 
              ? 'bg-white text-blue-700 shadow-md' 
              : 'text-gray-100 hover:bg-blue-600 hover:bg-opacity-30'}
            ${collapsed ? 'justify-center' : ''}`
          }
        >
          <FaMoneyBillWave className="text-lg" />
          {!collapsed && <span className="ml-3">Salaires</span>}
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center p-3 my-1 rounded-lg transition-all duration-300
            ${isActive 
              ? 'bg-white text-blue-700 shadow-md' 
              : 'text-gray-100 hover:bg-blue-600 hover:bg-opacity-30'}
            ${collapsed ? 'justify-center' : ''}`
          }
        >
          <FaCog className="text-lg" />
          {!collapsed && <span className="ml-3">Paramètres</span>}
        </NavLink>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-blue-400">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`flex items-center w-full p-3 rounded-lg bg-blue-600 bg-opacity-30 
            hover:bg-opacity-50 transition-all duration-300
            ${collapsed ? 'justify-center' : ''}`}
        >
          <FaSignOutAlt className="text-lg" />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </button>
      </div>

      {/* Confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <FaSignOutAlt className="text-2xl text-blue-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Confirmer la déconnexion
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir vous déconnecter de votre compte?
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSidebar;