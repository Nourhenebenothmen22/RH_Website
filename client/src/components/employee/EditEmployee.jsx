import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    dob: "",
    designation: "",
    department: "",
    itemtype: "",   
    gender: "",
    salary: "",
    password: "",
    profileImage: null,
  });
  
  const [currentImage, setCurrentImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  
  const API_BASE_URL = "http://localhost:5000";

  // Fonction pour construire l'URL correcte de l'image
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith("http")) {
      return imagePath;
    } else if (imagePath.startsWith("public/uploads/")) {
      return `${API_BASE_URL}/${imagePath}`;
    } else if (imagePath.startsWith("/public/uploads/")) {
      return `${API_BASE_URL}${imagePath}`;
    } else if (imagePath.startsWith("/")) {
      return `${API_BASE_URL}/public${imagePath}`;
    } else {
      return `${API_BASE_URL}/public/uploads/${imagePath}`;
    }
  };

  // Récupérer les départements
  const fetchDepartments = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/department`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Impossible de charger les départements");
    }
  };

  // Récupérer les données de l'employé
  const fetchEmployee = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_BASE_URL}/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.success) {
        const employee = response.data.data;
        setFormData({
          name: employee.name || "",
          email: employee.email || "",
          employeeId: employee.employeeId || "",
          dob: employee.dob ? employee.dob.split('T')[0] : "",
          designation: employee.designation || "",
          department: employee.department?._id || employee.department || "",
          gender: employee.gender || "",
          salary: employee.salary || "",
          password: "",
          profileImage: null
        });
        
        // Définir l'image actuelle pour l'aperçu
        if (employee.profileImage) {
          const imageUrl = getImageUrl(employee.profileImage);
          setCurrentImage(imageUrl);
        }
      } else {
        setError("Failed to fetch employee data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, [name]: files[0] });
      
      // Créer un aperçu pour la nouvelle image
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCurrentImage(e.target.result);
          setImageError(false);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const authToken = localStorage.getItem("authToken");
    const formDataObj = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/employee/${id}`,
        formDataObj,
        {
          headers: { 
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.data.success) {
        setSuccess("Employee updated successfully ✅");
        setTimeout(() => {
          navigate("/admin-dashboard/employees");
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "An error occurred ❌");
      } else {
        setError("Connection error ❌");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Edit Employee</h1>
          <Link
            to="/admin-dashboard/employees"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Employees
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-800">Edit Employee Details</h2>
              <p className="text-sm text-gray-600 mt-1">Update the employee information below</p>
            </div>
            <Link
              to="/admin-dashboard/employees"
              className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>

          {/* Messages */}
          <div className="px-6 pt-4">
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-md">
                {success}
              </div>
            )}
          </div>

          {/* Form Content */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {/* Profile Image Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  {currentImage && !imageError ? (
                    <img 
                      src={currentImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <input 
                    type="file" 
                    id="profileImage" 
                    name="profileImage" 
                    className="hidden" 
                    onChange={handleChange} 
                    accept="image/*" 
                  />
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Jane Doe"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="jane.doe@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    placeholder="EMP-001"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    placeholder="Frontend Developer"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.dep_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary ($) *</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    placeholder="3000"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Update Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}