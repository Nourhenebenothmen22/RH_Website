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
  const [filteredEmployees, setFilteredEmployees] = useState([]);
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
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Impossible de charger les départements");
    }
  };

  // Fetch employees from API
  const fetchEmployees = async () => {
    const authToken = localStorage.getItem("authToken");
    setEmployeeLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employee`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Impossible de charger les employés");
    } finally {
      setEmployeeLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  // Filter employees when department changes
  useEffect(() => {
    if (formData.department && employees.length > 0) {
      const filtered = employees.filter(emp => 
        emp.department && (emp.department._id === formData.department || emp.department === formData.department)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  }, [formData.department, employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.department || !formData.employee || !formData.basicSalary || !formData.payDate) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(`${API_BASE_URL}/api/salary`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.success) {
        setSuccess("Salaire ajouté avec succès!");
        
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
        }, 3000);
      } else {
        setError(response.data.message || "Erreur lors de l'ajout du salaire");
      }
    } catch (error) {
      console.error("Error adding salary:", error);
      setError(error.response?.data?.error || "Erreur lors de l'ajout du salaire");
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Gestion des Salaires</h1>
          <Link
            to="/admin-dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au Tableau de Bord
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-800">Ajouter un Salaire</h2>
              <p className="text-sm text-gray-600 mt-1">Renseignez les informations de salaire ci-dessous</p>
            </div>
            <Link
              to="/admin-dashboard/salaries-list"
              className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Voir la Liste
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
            {/* Department and Employee Selection */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">Sélection de l'Employé</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
                  <select
                    name="department"
                    value={formData.department}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                    disabled={!formData.department || employeeLoading}
                  >
                    <option value="">Sélectionnez un employé</option>
                    {filteredEmployees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                  {employeeLoading && <p className="text-xs text-gray-500 mt-1">Chargement des employés...</p>}
                  {formData.department && filteredEmployees.length === 0 && !employeeLoading && (
                    <p className="text-xs text-gray-500 mt-1">Aucun employé dans ce département</p>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">Informations Salariales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salaire de Base ($) *</label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={formData.basicSalary}
                    placeholder="3000"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              {/* Net Salary Display */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Salaire Net:</span>
                  <span className="text-lg font-bold text-blue-700">
                    ${calculateNetSalary()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Date */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">Date de Paiement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de Paiement *</label>
                  <input
                    type="date"
                    name="payDate"
                    value={formData.payDate}
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
                disabled={loading}
              >
                {loading ? "Traitement..." : "Ajouter le Salaire"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Salary;