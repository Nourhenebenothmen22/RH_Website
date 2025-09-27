import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function EmployeeAdd() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

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

  // Fetch departments from API
  const fetchDepartments = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://localhost:5000/api/department", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Impossible de charger les départements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, [name]: files[0] });
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
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee",
        formDataObj,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        setSuccess("Employé ajouté avec succès ✅");
        setTimeout(() => {
          navigate("/admin-dashboard/employees");
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Une erreur est survenue ❌");
      } else {
        setError("Erreur de connexion au serveur ❌");
      }
    }
  };

  return (
    <div className="min-full-screen flex flex-col shadow-sm">
      {/* Header Section */}
      <div>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-end">
          <div>
            <Link
              to="/admin-dashboard/employees"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg
                className="-ml-1 mr-1.5 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
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
            <h2 className="text-base font-medium text-gray-800">
              Add New Employee
            </h2>
            <Link
              to="/admin-dashboard/employees"
              className="text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>

          <p className="text-xs text-gray-600 mb-4">
            Fill the form to create a new employee.
          </p>

          {/* 🔥 Messages */}
          {error && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane.doe@example.com"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  placeholder="EMP-0001"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Birth, Designation, Department */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Frontend Developer"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((dept, index) => (
                    <option
                      key={dept._id || dept.id || index}
                      value={dept._id || dept.id}
                    >
                      {dept.dep_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role, Gender, Salary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="itemtype"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select role</option>
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  placeholder="3000"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password & Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center px-2 py-1 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50 text-xs text-gray-700">
                    <input
                      type="file"
                      name="profileImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    Choose file
                  </label>
                  <span className="text-xs text-gray-500">
                    PNG, JPG up to 5MB
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
