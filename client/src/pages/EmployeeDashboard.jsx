import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../EmployeeDashboard/Sidebar'

function EmployeeDashboard() {
  return (
     <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <Navbar />
        
        <main className="flex-1 p-6 mt-16">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default EmployeeDashboard