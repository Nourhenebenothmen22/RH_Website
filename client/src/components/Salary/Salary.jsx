import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Salary() {
  const [formData, setFormData] = useState({
    department: "",
    employee: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    payDate: ""
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000";

  // Fetch departments from API
  const fetchDepartments = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/department`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.success) {
        setDepartments(response.data.departments || response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Impossible de charger les départements");
    }
  };

  // Fetch employees by department from API
  const fetchEmployeesByDepartment = async (departmentId) => {
    if (!departmentId) {
      setEmployees([]);
      return;
    }
    
    const authToken = localStorage.getItem("authToken");
    setEmployeeLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/employee/department/${departmentId}`, 
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        const employeesData = response.data.data || response.data.employees || [];
        setEmployees(employeesData);
      }
    } catch (error) {
      console.error("Error fetching employees by department:", error);
      setError("Impossible de charger les employés de ce département");
    } finally {
      setEmployeeLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch employees when department changes
  useEffect(() => {
    if (formData.department) {
      fetchEmployeesByDepartment(formData.department);
    } else {
      setEmployees([]);
    }
    
    // Reset employee selection when department changes
    setFormData(prev => ({ ...prev, employee: "" }));
  }, [formData.department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Validation
    if (!formData.department || !formData.employee || !formData.basicSalary || !formData.payDate) {
      setError("Veuillez remplir tous les champs obligatoires");
      setLoading(false);
      return;
    }
    
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(`${API_BASE_URL}/api/salary`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.success) {
        setSuccess("Salaire ajouté avec succès!");
        console.log("Salary added:", response.data.data);
        
        // Réinitialiser le formulaire après un délai
        setTimeout(() => {
          setFormData({
            department: "",
            employee: "",
            basicSalary: "",
            allowances: "",
            deductions: "",
            payDate: ""
          });
          setSuccess(null);
          setEmployees([]);
        }, 3000);
      } else {
        setError(response.data.message || "Erreur lors de l'ajout du salaire");
      }
    } catch (error) {
      console.error("Error adding salary:", error);
      setError(error.response?.data?.error || "Erreur lors de l'ajout du salaire");
    } finally {
      setLoading(false);
    }
  };

  // Calcul du salaire net pour l'affichage
  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return (basic + allowances - deductions).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm py-3 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Gestion des Salaires</h1>
          </div>
          <Link
            to="/admin-dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tableau de Bord
          </Link>
        </div>
      </div>

      {/* Main Content - Utilisation de flex pour occuper tout l'espace disponible */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Ajouter un Salaire</h2>
                <p className="text-blue-100 text-sm">Renseignez les informations de salaire</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="px-6 pt-4">
            {error && (
              <div className="mb-3 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200 flex items-center">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-3 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}
          </div>

          {/* Form Content avec défilement interne si nécessaire */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Department and Employee Selection */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="text-md font-semibold text-blue-800 mb-3">Sélection de l'Employé</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
                    <select
                      name="department"
                      value={formData.department}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez un département</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.dep_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employé *</label>
                    <select
                      name="employee"
                      value={formData.employee}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      required
                      disabled={!formData.department || employeeLoading}
                    >
                      <option value="">Sélectionnez un employé</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} {emp.employeeId && `(${emp.employeeId})`}
                        </option>
                      ))}
                    </select>
                    {employeeLoading && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <svg className="animate-spin mr-1 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Chargement...
                      </p>
                    )}
                    {formData.department && employees.length === 0 && !employeeLoading && (
                      <p className="text-xs text-gray-500 mt-1">Aucun employé dans ce département</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Informations Salariales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salaire de Base ($) *</label>
                    <input
                      type="number"
                      name="basicSalary"
                      value={formData.basicSalary}
                      placeholder="3000"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allocations ($)</label>
                    <input
                      type="number"
                      name="allowances"
                      value={formData.allowances}
                      placeholder="500"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Déductions ($)</label>
                    <input
                      type="number"
                      name="deductions"
                      value={formData.deductions}
                      placeholder="200"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                {/* Net Salary Display */}
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Salaire Net:</span>
                    <span className="text-lg font-bold text-blue-700">
                      ${calculateNetSalary()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Date */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="text-md font-semibold text-blue-800 mb-3">Date de Paiement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de Paiement *</label>
                    <input
                      type="date"
                      name="payDate"
                      value={formData.payDate}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center disabled:opacity-75"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </>
                  ) : (
                    "Ajouter le Salaire"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Salary;