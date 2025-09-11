import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EmployeeSalary() {
  const API_BASE_URL = "http://localhost:5000";
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("authToken");

  // Fetch employee data + salaries en parallèle
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      const [employeeRes, salaryRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/employee/${id}`, { headers }),
        axios
          .get(`${API_BASE_URL}/api/salary/employee/${id}`, { headers })
          .catch(() =>
            axios.get(`${API_BASE_URL}/api/salary`, {
              headers,
              params: { employeeId: id },
            })
          ),
      ]);

      if (employeeRes.data.success) setEmployeeData(employeeRes.data.employee);

      if (salaryRes.data.success) {
        setSalaries(salaryRes.data.data || salaryRes.data.salaries || []);
      } else {
        setSalaries([]);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Gestion des Salaires
          </h1>
          {employeeData && (
            <p className="text-sm text-gray-600 mt-1">
              Employé: {employeeData.name} (ID: {employeeData.employeeId})
            </p>
          )}
        </div>
        <button
          onClick={() => navigate(`/admin-dashboard/employees`)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
        >
          Retour à la liste
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">Chargement des salaires...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-6xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="max-w-6xl mx-auto">
          {salaries.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">ID Employé</th>
                    <th className="px-4 py-3">Date de Paiement</th>
                    <th className="px-4 py-3">Salaire de Base</th>
                    <th className="px-4 py-3">Allocations</th>
                    <th className="px-4 py-3">Déductions</th>
                    <th className="px-4 py-3">Salaire Net</th>
                    <th className="px-4 py-3">Département</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((salary) => (
                    <tr
                      key={salary._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        {salary.employee?.employeeId || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {salary.payDate
                          ? new Date(salary.payDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">${salary.basicSalary || 0}</td>
                      <td className="px-4 py-3">${salary.allowances || 0}</td>
                      <td className="px-4 py-3">${salary.deductions || 0}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">
                        ${salary.netSalary || 0}
                      </td>
                      <td className="px-4 py-3">
                        {salary.department?.dep_name || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Aucun salaire trouvé
              </h3>
              <p className="text-gray-500">
                Cet employé n'a pas encore de fiche de salaire.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EmployeeSalary;
