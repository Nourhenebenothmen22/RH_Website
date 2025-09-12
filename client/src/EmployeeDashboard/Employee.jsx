import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useParams } from "react-router-dom";

function Employee() {
  const { user } = useAuth(); // récupère le user connecté
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id}=useParams()

 useEffect(() => {
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`/api/employee/${user.id}`);
      setEmployeeData(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des données");
      setLoading(false);
    }
  };

  if (user?.id) {
    fetchEmployeeData();
  }
}, [user]);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenue, {user?.name} 👋</h1>
      <p className="text-gray-700 mb-6">
        Voici votre tableau de bord personnalisé pour suivre vos informations et votre performance.
      </p>

      {employeeData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Département</h2>
            <p>{employeeData.department?.name || "Non défini"}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Salaire actuel</h2>
            <p>{employeeData.salary ? `${employeeData.salary} TND` : "Non défini"}</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Statut marital</h2>
            <p>{employeeData.maritalStatus || "Non défini"}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg shadow col-span-full">
            <h2 className="text-lg font-semibold mb-2">Proposition du jour 🌟</h2>
            <p>Profitez de notre programme de formation en ligne pour booster vos compétences !</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employee;
