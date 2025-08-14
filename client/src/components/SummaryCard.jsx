import React from 'react'

function SummaryCard({icon, title, value, color = "text-gray-600"}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-lg bg-gray-50">
          {React.cloneElement(icon, { 
            className: `text-xl ${color} ${icon.props.className || ''}` 
          })}
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard