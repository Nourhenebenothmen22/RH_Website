import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';

function DepartmentList() {
  return (
    <div className="p-3 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5">
        Department Management
      </h1>

      {/* Container for search bar and add button - aligned on the same line */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by department name..."
            className="w-100 pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
          />
        </div>

        {/* Add button */}
        <Link
          to="/admin-dashboard/add-department"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FaPlus className="text-sm" />
          <span>Add Department</span>
        </Link>
      </div>
    </div>
  );
}

export default DepartmentList;
