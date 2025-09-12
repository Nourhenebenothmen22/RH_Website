import React from 'react'
import SummaryCard from './SummaryCard'
import { 
  FaUsers, 
  FaBuilding, 
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle
} from 'react-icons/fa'
import { useState, useEffect } from 'react';



function AdminSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/dashboard/summary', {
          headers: { 
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        const data = await response.json()
        
        if (data.success) {
          setSummary(data.data)
        } else {
          setError('Erreur lors du chargement des données')
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du résumé:", error)
        setError('Erreur de connexion au serveur')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSummary()
  }, [])


  if (loading) {
    return (
      <div className="p-5">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="p-5">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          Aucune donnée disponible
        </div>
      </div>
    )
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Aperçu du Tableau de Bord</h1>
      <p className="text-gray-500 mb-6">Indicateurs clés de performance et métriques</p>
      
      {/* Main Metrics Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Métriques Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard 
            icon={<FaUsers />} 
            title={"Employés"} 
            value={summary.totalEmployees}
            color="text-blue-500"
          />
          
          <SummaryCard 
            icon={<FaBuilding />} 
            title={"Départements"} 
            value={summary.totalDepartments}
            color="text-indigo-500"
          />
          
          <SummaryCard 
            icon={<FaMoneyBillWave />} 
            title={"Masse Salariale"} 
            value={`€${summary.totalPayroll.toLocaleString()}`}
            color="text-green-500"
          />
        </div>
      </div>

      {/* Leave Management Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Gestion des Congés</h2>
          <div className="text-sm text-blue-600 cursor-pointer hover:underline">Voir tout</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard 
            icon={<FaFileAlt />} 
            title={"Congés Demandés"} 
            value={143}
            color="text-blue-500"
          />
          
          <SummaryCard 
            icon={<FaCheckCircle />} 
            title={"Congés Approuvés"} 
            value={98}
            color="text-green-500"
          />
          
          <SummaryCard 
            icon={<FaHourglassHalf />} 
            title={"Congés en Attente"} 
            value={32}
            color="text-amber-500"
          />
          
          <SummaryCard 
            icon={<FaTimesCircle />} 
            title={"Congés Rejetés"} 
            value={13}
            color="text-red-500"
          />
        </div>
      </div>
    </div>
  )
}

export default AdminSummary