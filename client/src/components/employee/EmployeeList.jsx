import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUser } from "react-icons/fa";
import DataTable from "react-data-table-component";
import axios from "axios";

function EmployeeList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employee",
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/employee/${id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (response.data.success) {
          fetchEmployees();
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        setError("Failed to delete employee. Please try again.");
      }
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Profile Image Component to handle errors
  const ProfileImage = ({ imageUrl }) => {
    const [imgError, setImgError] = useState(false);
    
    if (imgError || !imageUrl) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <FaUser className="text-gray-500" />
        </div>
      );
    }
    
    return (
      <img 
        src={imageUrl} 
        alt="Profile" 
        className="w-10 h-10 rounded-full object-cover" 
        onError={() => setImgError(true)}
        crossOrigin="anonymous"
      />
    );
  };

  const columns = [
    { 
      name: "S.No", 
      selector: (row) => row.sno, 
      sortable: true,
      width: "80px"
    },
    {
      name: "Employee ID",
      selector: (row) => row.employeeId,
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) => {
        // Construct proper image URL
        let imageUrl = null;
        if (row.profileImage) {
          // Handle different image path formats
          if (row.profileImage.startsWith('http')) {
            imageUrl = row.profileImage;
          } else if (row.profileImage.startsWith('uploads/')) {
            imageUrl = `http://localhost:5000/${row.profileImage}`;
          } else if (row.profileImage.startsWith('/')) {
            imageUrl = `http://localhost:5000${row.profileImage}`;
          } else {
            imageUrl = `http://localhost:5000/uploads/${row.profileImage}`;
          }
        }
        
        return <ProfileImage imageUrl={imageUrl} />;
      },
      sortable: false,
      width: "200px"
    },
    {
      name: "DOB",
      selector: (row) => row.dob,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
            onClick={() => navigate(`/admin-dashboard/edit-employee/${row.id}`)}
            title="Edit employee"
          >
            <FaEdit />
          </button>
          <button
            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
            onClick={() => handleDelete(row.id)}
            title="Delete employee"
          >
            <FaTrash />
          </button>
        </div>
      ),
      sortable: false,
      width: "120px"
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#f3f4f6',
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        padding: '12px 8px',
      },
    },
  };

  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5">
        Employee Management
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="w-full md:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by ID, email, or name..."
              className="w-full md:w-64 pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-colors text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Link
          to="/admin-dashboard/add-employee"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 text-sm whitespace-nowrap"
        >
          <FaPlus className="text-xs" />
          <span>Add Employee</span>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
          noDataComponent={
            <div className="py-8 text-center text-gray-500">
              {searchTerm ? "No matching employees found" : "No employees found"}
            </div>
          }
        />
      </div>
    </div>
  );
}

export default EmployeeList;