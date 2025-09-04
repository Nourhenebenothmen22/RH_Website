import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function EmployeeList() {
  // Exemple de colonnes (juste design)
  /*  const columns = [
    {
      name: "S.No",
      selector: (row) => row.sno,
      sortable: true,
      width: "80px",
    },
    {
      name: "Employee Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Actions",
      cell: () => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <FaEdit />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <FaTrash />
          </button>
        </div>
      ),
      width: "100px",
    },
  ];
 */

  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5">
        Employee Management
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4 ">
        {/* Search bar */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee name..."
            className="w-100 pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
          />
        </div>

        {/* Add employee button */}
        <Link
          to="/admin-dashboard/add-employee"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FaPlus className="text-sm" />
          <span>Add Employee</span>
        </Link>
      </div>
    </div>
  );
}

export default EmployeeList;
