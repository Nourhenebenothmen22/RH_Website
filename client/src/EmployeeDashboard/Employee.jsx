import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { 
  FaUserCircle, 
  FaMoneyBillWave, 
  FaBuilding, 
  FaVenusMars,
  FaBirthdayCake,
  FaIdCard,
  FaProjectDiagram,
  FaCalendarCheck,
  FaGraduationCap,
  FaChartLine,
  FaUsers,
  FaAward,
  FaEye
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

// Composant pour l'image de profil avec gestion d'erreur
const ProfileImage = ({ imageUrl, size = "w-28 h-28" }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError || !imageUrl) {
    return (
      <div
        className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg`}
      >
        <FaUserCircle className="text-white text-4xl" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Profile"
      className={`${size} rounded-full object-cover border-4 border-white shadow-lg`}
      onError={() => setImgError(true)}
      crossOrigin="anonymous"
    />
  );
};

function Employee() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id, user]);

  const fetchEmployee = async () => {
    try {
      const employeeId = id || user?.id || localStorage.getItem('userId');
      
      if (!employeeId) {
        setError("Aucun ID d'employé spécifié");
        setLoading(false);
        return;
      }

      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Token d'authentification manquant");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/employee/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        setEmployee(response.data.data);
      } else {
        setError("Échec de la récupération des données de l'employé");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'employé:", error);
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Erreur lors de la récupération des données");
      }
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = () => {
    if (!employee?.profileImage) return null;

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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="w-full max-w-full mx-auto">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700 font-medium">Chargement de vos données...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes("Session expirée") && (
            <p className="text-sm text-gray-500">Redirection vers la page de connexion...</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec bienvenue */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all hover:shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
          
          <div className="flex flex-col md:flex-row items-center relative z-10">
            {/* Image de profil au centre */}
            <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
              <div className="relative">
                <ProfileImage imageUrl={profileImageUrl} size="w-32 h-32" />
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-white">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">Bonjour, {employee?.name || user?.name} ! 👋</h1>
              <p className="text-gray-600 text-lg mb-6">Heureux de vous revoir. Voici votre tableau de bord personnel.</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full flex items-center shadow-sm">
                  <FaIdCard className="mr-2" /> ID: {employee?.employeeId || "Non spécifié"}
                </span>
                <span className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full flex items-center shadow-sm">
                  <FaBuilding className="mr-2" /> 
                  {employee?.department?.dep_name || "Non spécifié"}
                </span>
                <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-2 rounded-full flex items-center shadow-sm">
                  <FaAward className="mr-2" />
                  {employee?.designation || "Non spécifié"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cartes d'informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <FaVenusMars className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Genre</h3>
                <p className="text-2xl font-bold text-gray-900">{employee?.gender || "Non spécifié"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <FaBirthdayCake className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Date de naissance</h3>
                <p className="text-xl font-bold text-gray-900">
                  {employee?.dob ? new Date(employee.dob).toLocaleDateString('fr-FR') : "Non spécifié"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <FaMoneyBillWave className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Salaire</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {employee?.salary ? `${employee.salary.toLocaleString('fr-FR')} TND` : "Non spécifié"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-xl mr-4">
                <FaUsers className="text-orange-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Statut marital</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {employee?.maritalStatus || "Non spécifié"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projets en cours */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 transform transition-all hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-3">
            <FaProjectDiagram className="text-indigo-600 mr-3 text-2xl" />
            Projets en cours
          </h2>
          {employee?.projects && employee.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {employee.projects.map((proj) => (
                <div key={proj._id} className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 pl-5 p-4 rounded-xl">
                  <h3 className="font-bold text-indigo-800 text-lg mb-2">{proj.name}</h3>
                  <p className="text-gray-700">{proj.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaProjectDiagram className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun projet en cours</p>
            </div>
          )}
        </div>

        {/* Présences récentes */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 transform transition-all hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-3">
            <FaCalendarCheck className="text-green-600 mr-3 text-2xl" />
            Présences récentes
          </h2>
          {employee?.attendances && employee.attendances.length > 0 ? (
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Heure d'arrivée</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Heure de départ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employee.attendances.slice(0, 5).map((att) => (
                    <tr key={att._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        {att.date ? new Date(att.date).toLocaleDateString('fr-FR') : "N/A"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          att.status === "present" ? 
                            "bg-green-100 text-green-800" : 
                          att.status === "absent" ? 
                            "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"
                        }`}>
                          {att.status === "present" ? "Présent" : 
                           att.status === "absent" ? "Absent" : 
                           att.status || "Inconnu"}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">{att.checkIn || "N/A"}</td>
                      <td className="px-5 py-4 whitespace-nowrap">{att.checkOut || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaCalendarCheck className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune présence enregistrée</p>
            </div>
          )}
        </div>

        {/* Salaires */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 transform transition-all hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-3">
            <FaChartLine className="text-blue-600 mr-3 text-2xl" />
            Historique des salaires
          </h2>
          {employee?.salaries && employee.salaries.length > 0 ? (
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Date de paiement</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Salaire de base</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Allocations</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Déductions</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Salaire net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employee.salaries.map((salary) => (
                    <tr key={salary._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        {salary.payDate ? new Date(salary.payDate).toLocaleDateString('fr-FR') : "N/A"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">{salary.basicSalary?.toLocaleString('fr-FR') || "N/A"} TND</td>
                      <td className="px-5 py-4 whitespace-nowrap">{salary.allowances?.toLocaleString('fr-FR') || "N/A"} TND</td>
                      <td className="px-5 py-4 whitespace-nowrap">{salary.deductions?.toLocaleString('fr-FR') || "N/A"} TND</td>
                      <td className="px-5 py-4 whitespace-nowrap font-bold text-green-700">
                        {salary.netSalary?.toLocaleString('fr-FR') || "N/A"} TND
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaChartLine className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun historique de salaire</p>
            </div>
          )}
        </div>

        {/* Proposition de formation */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl p-8 text-white transform transition-all hover:scale-[1.02]">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-6">
              <div className="bg-white/20 p-5 rounded-2xl">
                <FaGraduationCap className="text-4xl" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Développez vos compétences !</h2>
              <p className="text-lg mb-6 opacity-90">
                Profitez de notre programme de formation continue avec un budget alloué de 1500€ par an.
                Améliorez vos compétences et progressez dans votre carrière.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1">
                  Explorer les formations
                </button>
                <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:-translate-y-1">
                  Planifier un entretien
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee;