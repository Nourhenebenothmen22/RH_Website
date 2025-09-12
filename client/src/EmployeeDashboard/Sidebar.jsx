import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBuilding, 
  FaUsers, 
  FaMoneyBillWave, 
  FaCog, 
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHeart,
  FaCalendarAlt
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDashboardActive = location.pathname.startsWith('/admin-dashboard') && 
                           !location.pathname.includes('/admin-dashboard/');

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg lg:hidden shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen z-50 
        bg-gradient-to-br from-blue-50 to-blue-100
        text-gray-800 shadow-xl flex flex-col w-64
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-gray-200
      `}>

        {/* Header with new logo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm">
              <FaHeart className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold">PeopleFirst</h3>
              <p className="text-xs text-gray-500">Talent Management</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Menu */}
        <div className="p-4 mt-2 flex-1 overflow-y-auto">
          <div className="mb-4 pl-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Navigation</p>
          </div>
          
          <NavLink 
            to="/Employee-dashboard" 
            className={({ isActive }) => 
              `flex items-center p-3 my-2 rounded-lg transition-all duration-300
              ${isDashboardActive 
                ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`
            }
            onClick={handleLinkClick}
          >
            <FaTachometerAlt className="text-lg" />
            <span className="ml-3 font-medium">Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/Employee-dashboard/profile" 
            className={({ isActive }) => 
              `flex items-center p-3 my-2 rounded-lg transition-all duration-300
              ${isActive 
                ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`
            }
            onClick={handleLinkClick}
          >
            <FaBuilding className="text-lg" />
            <span className="ml-3 font-medium">My profil</span>
          </NavLink>
          
          <NavLink 
            to="/Employee-dashboard/leaves" 
            className={({ isActive }) => 
              `flex items-center p-3 my-2 rounded-lg transition-all duration-300
              ${isActive 
                ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`
            }
            onClick={handleLinkClick}
          >
            <FaUsers className="text-lg" />
            <span className="ml-3 font-medium">Leaves</span>
          </NavLink>
          
          <NavLink 
            to="/Employee-dashboard/Salary" 
            className={({ isActive }) => 
              `flex items-center p-3 my-2 rounded-lg transition-all duration-300
              ${isActive 
                ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`
            }
            onClick={handleLinkClick}
          >
            <FaMoneyBillWave className="text-lg" />
            <span className="ml-3 font-medium">Salaries</span>
          </NavLink>

          
          
          <div className="mt-8 mb-4 pl-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Administration</p>
          </div>
          
          <NavLink 
            to="/employee-dashboard/settings" 
            className={({ isActive }) => 
              `flex items-center p-3 my-2 rounded-lg transition-all duration-300
              ${isActive 
                ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`
            }
            onClick={handleLinkClick}
          >
            <FaCog className="text-lg" />
            <span className="ml-3 font-medium">Settings</span>
          </NavLink>
        </div>

      </div>
    </>
  );
}

export default Sidebar;