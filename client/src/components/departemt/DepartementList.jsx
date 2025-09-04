import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import axios from "axios";

function DepartmentList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let toastTimer;
    if (showToast) {
      toastTimer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
    
    return () => {
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, [showToast]);

  // Gestion des messages de redirection
  useEffect(() => {
    if (location.state?.showToast) {
      setToastMessage(location.state.message);
      setToastType(location.state.type || "success");
      setShowToast(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const fetchDepartments = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/department",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        const departmentsData = response.data.departments.map(
          (dep, index) => ({
            id: dep._id,
            sno: index + 1,
            dep_name: dep.dep_name,
          })
        );
        setDepartments(departmentsData);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/department/${id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (response.data.success) {
          setToastMessage("Department deleted successfully");
          setToastType("success");
          setShowToast(true);
          // Refresh the department list
          fetchDepartments();
        }
      } catch (error) {
        console.error("Error deleting department:", error);
        setToastMessage("Failed to delete department");
        setToastType("error");
        setShowToast(true);
      }
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      name: "S.No", 
      selector: (row) => row.sno, 
      sortable: true,
      width: "80px"
    },
    {
      name: "Department Name",
      selector: (row) => row.dep_name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-900"
            onClick={() => navigate(`/admin-dashboard/edit-department/${row.id}`)}
          >
            <FaEdit />
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
      sortable: false,
      width: "100px"
    },
  ];

  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-fadeInOut`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {toastType === "success" ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              )}
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
            className="w-100 pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="bg-white rounded-lg shadow-md p-4">
        <DataTable
          columns={columns}
          data={filteredDepartments}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
}

export default DepartmentList;