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

function AdminSummary() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard Overview</h1>
      <p className="text-gray-500 mb-6">Key metrics and performance indicators</p>
      
      {/* Main Metrics Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Core Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard 
            icon={<FaUsers />} 
            title={"Employees"} 
            value={143}
            color="text-blue-500"
          />
          
          <SummaryCard 
            icon={<FaBuilding />} 
            title={"Departments"} 
            value={8}
            color="text-indigo-500"
          />
          
          <SummaryCard 
            icon={<FaMoneyBillWave />} 
            title={"Payroll"} 
            value={"€124,320"}
            color="text-green-500"
          />
        </div>
      </div>
      
      {/* Leave Management Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Leave Management</h2>
          <div className="text-sm text-blue-600 cursor-pointer hover:underline">View all</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard 
            icon={<FaFileAlt />} 
            title={"Leave Applied"} 
            value={143}
            color="text-blue-500"
          />
          
          <SummaryCard 
            icon={<FaCheckCircle />} 
            title={"Leave Approved"} 
            value={98}
            color="text-green-500"
          />
          
          <SummaryCard 
            icon={<FaHourglassHalf />} 
            title={"Leave Pending"} 
            value={32}
            color="text-amber-500"
          />
          
          <SummaryCard 
            icon={<FaTimesCircle />} 
            title={"Leave Rejected"} 
            value={13}
            color="text-red-500"
          />
        </div>
      </div>
    </div>
  )
}

export default AdminSummary;