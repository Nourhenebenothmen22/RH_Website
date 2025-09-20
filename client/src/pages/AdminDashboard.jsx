import React from 'react'
import AdminSidebar from '../components/AdminSidebar'
import AdminSummary from '../components/AdminSummary'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminDashboard() {
  const { user } = useAuth()
  
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <Navbar />
        
        <main className="flex-1 p-6 mt-16">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard