import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import axios from 'axios';

function DepartmentList() {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.showToast) {
      setToastMessage(location.state.message);
      setShowToast(true);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:5000/api/department', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        if (response.data.success) {
          const departmentsData = response.data.departments.map((dep, index) => ({
            id: dep._id,
            sno: index + 1,
            dep_name: dep.dep_name,
            action: (
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900" onClick={() => navigate(`/admin-dashboard/edit-department/${dep._id}`)}>
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <FaTrash />
                </button>
              </div>
            )
          }));
          setDepartments(departmentsData);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const columns = [
    { name: 'S.No', selector: row => row.sno, sortable: true },
    { name: 'Department Name', selector: row => row.dep_name, sortable: true },
    { name: 'Actions', selector: row => row.action, sortable: false }
  ];

  return (
    <div className="p-3 md:p-6">
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-fadeInOut">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {toastMessage}
          </div>
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5">
        Department Management
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by department name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
          />
        </div>

        <Link
          to="/admin-dashboard/add-department"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FaPlus className="text-sm" />
          <span>Add Department</span>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={departments}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}

export default DepartmentList;