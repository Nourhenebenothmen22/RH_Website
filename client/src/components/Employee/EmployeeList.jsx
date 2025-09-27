import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaEdit, FaEye, FaMoneyBill, FaCalendarAlt, FaUser } from "react-icons/fa";
import DataTable from "react-data-table-component";
import axios from "axios";

function EmployeeList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // URL de base de l'API
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/employee`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        const employeesData = (response.data.employees || response.data.data || []).map((emp, index) => ({
          id: emp._id,
          sno: index + 1,
          employeeId: emp.employeeId,
          profileImage: emp.profileImage,
          name: emp.name || "",
          dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : "N/A",
          email: emp.email,
          department: emp.department?.dep_name || "N/A",
        }));
        setEmployees(employeesData);
        setError("");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Profile Image Component to handle errors
  const ProfileImage = ({ imageUrl }) => {
    const [imgError, setImgError] = useState(false);
    
    if (imgError || !imageUrl) {
      return (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <FaUser className="text-gray-400 text-xs" />
        </div>
      );
    }
    
    return (
      <img 
        src={imageUrl} 
        alt="Profile" 
        className="w-8 h-8 rounded-full object-cover border border-gray-200" 
        onError={() => setImgError(true)}
        crossOrigin="anonymous"
      />
    );
  };

  const columns = [
    { 
      name: "#", 
      selector: (row) => row.sno, 
      sortable: true,
      width: "50px",
      center: true,
    },
    {
      name: "Photo",
      cell: (row) => {
        let imageUrl = null;
        if (row.profileImage) {
          if (row.profileImage.startsWith('http')) {
            imageUrl = row.profileImage;
          } else if (row.profileImage.startsWith('public/uploads/')) {
            imageUrl = `${API_BASE_URL}/${row.profileImage}`;
          } else if (row.profileImage.startsWith('/public/uploads/')) {
            imageUrl = `${API_BASE_URL}${row.profileImage}`;
          } else if (row.profileImage.startsWith('/')) {
            imageUrl = `${API_BASE_URL}/public${row.profileImage}`;
          } else {
            imageUrl = `${API_BASE_URL}/public/uploads/${row.profileImage}`;
          }
        }
        
        return <ProfileImage imageUrl={imageUrl} />;
      },
      sortable: false,
      width: "60px",
      center: true
    },
    {
      name: "ID",
      selector: (row) => row.employeeId,
      sortable: true,
      width: "100px",
      wrap: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      minWidth: "150px",
      grow: 1,
    },
    {
      name: "DOB",
      selector: (row) => row.dob,
      sortable: true,
      width: "100px",
      wrap: true
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      minWidth: "200px",
      grow: 2,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
      width: "150px",
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex flex-row space-x-1 h-full items-center">
          <button
            className="text-white bg-blue-500 hover:bg-blue-600 p-1.5 rounded flex items-center justify-center transition-colors text-xs"
            onClick={() => navigate(`/admin-dashboard/view-employee/${row.id}`)}
            title="View employee"
          >
            <FaEye className="text-xs" />
          </button>
          <button
            className="text-white bg-green-500 hover:bg-green-600 p-1.5 rounded flex items-center justify-center transition-colors text-xs"
            onClick={() => navigate(`/admin-dashboard/employee-salary/${row.id}`)}
            title="Salary details"
          >
            <FaMoneyBill className="text-xs" />
          </button>
          <button
            className="text-white bg-purple-500 hover:bg-purple-600 p-1.5 rounded flex items-center justify-center transition-colors text-xs"
            onClick={() => navigate(`/admin-dashboard/employee-leave/${row.id}`)}
            title="Leave management"
          >
            <FaCalendarAlt className="text-xs" />
          </button>
          <button
            className="text-white bg-amber-500 hover:bg-amber-600 p-1.5 rounded flex items-center justify-center transition-colors text-xs"
            onClick={() => navigate(`/admin-dashboard/edit-employee/${row.id}`)}
            title="Edit employee"
          >
            <FaEdit className="text-xs" />
          </button>
        </div>
      ),
      sortable: false,
      width: "140px",
      center: true
    },
  ];

  const customStyles = {
    table: {
      style: {
        width: "100%",
      },
    },
    head: {
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    headCells: {
      style: {
        backgroundColor: '#2563eb',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        padding: '8px 4px',
        borderBottom: '2px solid #1e40af',
      },
    },
    cells: {
      style: {
        fontSize: '12px',
        padding: '6px 4px',
        minHeight: '40px',
      },
    },
    rows: {
      style: {
        minHeight: '40px',
        backgroundColor: '#ffffff',
        '&:not(:last-of-type)': {
          borderBottom: '1px solid #f1f5f9',
        },
        '&:hover': {
          backgroundColor: '#f0f9ff',
        },
      },
      stripedStyle: {
        backgroundColor: '#f8fafc',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        fontSize: '12px',
        padding: '8px 0',
      },
    },
  };

  return (
    <div className="p-3 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">Employee Management</h1>
            <p className="text-xs text-gray-600">Manage your organization's employees</p>
          </div>

          <Link
            to="/admin-dashboard/add-employee"
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md shadow-sm transition-colors duration-200 text-xs mt-2 md:mt-0"
          >
            <FaPlus className="text-xs" />
            <span>Add Employee</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-4 text-xs flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
          <div className="w-full">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full pl-8 pr-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-colors text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-md overflow-hidden border border-gray-200">
          <DataTable
            columns={columns}
            data={filteredEmployees}
            progressPending={loading}
            pagination
            highlightOnHover
            striped
            customStyles={customStyles}
            noDataComponent={
              <div className="py-8 text-center text-gray-500 text-xs">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">{searchTerm ? "No matching employees found" : "No employees found"}</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;