import React from "react";
import { Link } from "react-router-dom";

export default function EmployeeAdd() {
  return (
    <div className="min-full-screen flex flex-col shadow-sm">
      {/* Header Section */}
      <div>
         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-end">
          {/* Right: Add Button */}
          <div>
            <Link
              to="/admin-dashboard/employees"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="-ml-1 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Employee
            </Link>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 py-4 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-800">Add New Employee</h2>
            <Link
              to="/admin-dashboard/employees"
              className="text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>

          <p className="text-xs text-gray-600 mb-4">Fill the form to create a new employee.</p>

          <form className="space-y-4">
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" placeholder="Jane Doe" className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="jane.doe@example.com" className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Employee ID</label>
                <input type="text" placeholder="EMP-0001" className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
            </div>

            {/* Birth, Designation, Department */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
                <input type="text" placeholder="Frontend Developer" className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select department</option>
                  
                </select>
              </div>
            </div>

            {/* Role, Gender, Salary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select role</option>
                  <option>Employee</option>
                  <option>Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                <select className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select gender</option>
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Salary</label>
                <input type="number" placeholder="3000" className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
            </div>

            {/* Password & Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input type="password" placeholder="********" className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Profile Image</label>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center px-2 py-1 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50 text-xs text-gray-700">
                    <input type="file" className="hidden" accept="image/*"/>
                    Choose file
                  </label>
                  <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
