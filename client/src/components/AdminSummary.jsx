import React from 'react'
import SummaryCard from './SummaryCard'
import { 
  FaUsers, 
  FaBuilding, 
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaUserCheck,
  FaUserTimes,
  FaClock,
  FaCalendarCheck
} from 'react-icons/fa'
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Données factices pour les congés (à remplacer par des données réelles quand l'API sera disponible)
const LEAVE_DATA = {
  requested: 143,
  approved: 98,
  pending: 32,
  rejected: 13
};

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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

  // Préparer les données pour le graphique de présence
  const attendanceData = summary ? [
    { name: 'Présents', value: summary.attendance.present || 0 },
    { name: 'Absents', value: summary.attendance.absent || 0 },
    { name: 'En retard', value: summary.attendance.late || 0 },
    { name: 'Congés', value: summary.attendance.onLeave || 0 }
  ] : [];

  // Préparer les données pour le graphique à barres
  const barChartData = summary ? [
    {
      name: 'Employés',
      total: summary.totalEmployees || 0,
    },
    {
      name: 'Départements',
      total: summary.totalDepartments || 0,
    }
  ] : [];

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
            bgColor="bg-blue-50"
          />
          
          <SummaryCard 
            icon={<FaBuilding />} 
            title={"Départements"} 
            value={summary.totalDepartments}
            color="text-indigo-500"
            bgColor="bg-indigo-50"
          />
          
          <SummaryCard 
            icon={<FaMoneyBillWave />} 
            title={"Masse Salariale (mois)"} 
            value={`${summary.totalPayroll.toLocaleString('fr-FR')} €`}
            color="text-green-500"
            bgColor="bg-green-50"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <FaCalendarCheck className="mr-2 text-blue-500" />
            Répartition des présences
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} employés`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employees/Departments Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <FaBuilding className="mr-2 text-indigo-500" />
            Employés et Départements
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Statistiques de Présence</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard 
            icon={<FaUserCheck />} 
            title={"Présents"} 
            value={summary.attendance.present || 0}
            color="text-green-500"
            bgColor="bg-green-50"
          />
          
          <SummaryCard 
            icon={<FaUserTimes />} 
            title={"Absents"} 
            value={summary.attendance.absent || 0}
            color="text-red-500"
            bgColor="bg-red-50"
          />
          
          <SummaryCard 
            icon={<FaClock />} 
            title={"En retard"} 
            value={summary.attendance.late || 0}
            color="text-amber-500"
            bgColor="bg-amber-50"
          />
          
          <SummaryCard 
            icon={<FaCalendarCheck />} 
            title={"Congés"} 
            value={summary.attendance.onLeave || 0}
            color="text-blue-500"
            bgColor="bg-blue-50"
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
            value={LEAVE_DATA.requested}
            color="text-blue-500"
            bgColor="bg-blue-50"
          />
          
          <SummaryCard 
            icon={<FaCheckCircle />} 
            title={"Congés Approuvés"} 
            value={LEAVE_DATA.approved}
            color="text-green-500"
            bgColor="bg-green-50"
          />
          
          <SummaryCard 
            icon={<FaHourglassHalf />} 
            title={"Congés en Attente"} 
            value={LEAVE_DATA.pending}
            color="text-amber-500"
            bgColor="bg-amber-50"
          />
          
          <SummaryCard 
            icon={<FaTimesCircle />} 
            title={"Congés Rejetés"} 
            value={LEAVE_DATA.rejected}
            color="text-red-500"
            bgColor="bg-red-50"
          />
        </div>
      </div>
    </div>
  )
}

export default AdminSummary