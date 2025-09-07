import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaPlus } from "react-icons/fa";

function EmployeeList() {
  
  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5">
        Employee Management
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Search bar - alignée à gauche */}
        <div className="w-full md:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by employee ID..."
              className="w-full md:w-64 pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {/* Add employee button - aligné à droite */}
        <Link
          to="/admin-dashboard/add-employee"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 text-sm whitespace-nowrap"
        >
          <FaPlus className="text-xs" />
          <span>Add Employee</span>
        </Link>
      </div>
    </div>
  );
}

export default EmployeeList;