import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaEnvelope,
  FaIdBadge,
  FaCalendarAlt,
  FaBuilding,
  FaUser,
  FaEye,
  FaHeart,
} from "react-icons/fa";

function ViewEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:5000/api/employee/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        setEmployee(response.data.data);
      } else {
        setError("Failed to fetch employee data");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      setError("Failed to fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  const ProfileImage = ({ imageUrl, size = "w-28 h-28" }) => {
    const [imgError, setImgError] = useState(false);

    if (imgError || !imageUrl) {
      return (
        <div
          className={`${size} rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-md`}
        >
          <FaEye className="text-gray-400 text-lg" />
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt="Profile"
        className={`${size} rounded-full object-cover border-2 border-white shadow-md`}
        onError={() => setImgError(true)}
        crossOrigin="anonymous"
      />
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative max-w-xl mx-auto mt-6 text-sm"
        role="alert"
      >
        <strong className="font-semibold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getProfileImageUrl = () => {
    if (!employee.profileImage) return null;

    if (employee.profileImage.startsWith("http")) {
      return employee.profileImage;
    } else if (employee.profileImage.startsWith("uploads/")) {
      return `http://localhost:5000/${employee.profileImage}`;
    } else if (employee.profileImage.startsWith("/")) {
      return `http://localhost:5000${employee.profileImage}`;
    } else {
      return `http://localhost:5000/uploads/${employee.profileImage}`;
    }
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <div className="max-w-5xl mx-auto px-3 py-3">
      {/* Back link */}
      <Link
        to="/admin-dashboard/employees"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-3 text-sm"
      >
        <FaArrowLeft className="mr-2" /> Back to Employee List
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        {/* Header coloré */}
        <div className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600">
          <h1 className="text-lg font-bold text-white">Employee Details</h1>
        </div>

        <div className="p-4 flex flex-col md:flex-row gap-4">
          {/* Left - Employee Details */}
          <div className="md:w-2/3 space-y-3">
            {/* Personal Info */}
            <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
              <h2 className="text-sm font-semibold text-indigo-700 mb-2">
                Personal Information
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FaUser className="text-indigo-500 mr-2" />
                  <span className="font-medium">{employee.name || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <FaIdBadge className="text-indigo-500 mr-2" />
                  <span>{employee.employeeId || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-indigo-500 mr-2" />
                  <span>{formatDate(employee.dob)}</span>
                </div>
               
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
              <h2 className="text-sm font-semibold text-purple-700 mb-2">
                Professional Information
              </h2>
              <div className="flex items-center text-sm">
                <FaBuilding className="text-purple-500 mr-2" />
                <span>{employee.department?.dep_name || "N/A"}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-green-50 p-3 rounded-md border border-green-100">
              <h2 className="text-sm font-semibold text-green-700 mb-2">
                Contact Information
              </h2>
              <div className="flex items-center text-sm">
                <FaEnvelope className="text-green-500 mr-2" />
                <span>{employee.email || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Right - Profile */}
          <div className="md:w-1/3 flex flex-col items-center bg-gray-50 p-3 rounded-md border border-gray-100">
            <ProfileImage imageUrl={profileImageUrl} size="w-28 h-28" />
            <div className="mt-3 text-center">
              <p className="text-base font-bold text-gray-800">{employee.name}</p>
              <p className="text-gray-600 text-xs">
                {employee.department?.dep_name || "N/A"}
              </p>
              <p className="text-gray-500 text-xs mt-1">{employee.employeeId}</p>
            </div>
            <Link
              to={`/admin-dashboard/edit-employee/${employee._id}`}
              className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployee;
