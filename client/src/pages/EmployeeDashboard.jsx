import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

function EmployeeDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6 mt-16 w-full max-w-full">
        <Outlet/>
      </main>
    </div>
  )
}

export default EmployeeDashboard