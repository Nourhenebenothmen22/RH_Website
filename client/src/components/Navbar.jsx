import React, { useState } from 'react'
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowLogoutConfirm(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 md:hidden">
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <FaBell className="text-lg" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUserCircle className="text-blue-500 text-xl" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                </div>
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Mon profil
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Paramètres
                  </button>
                </div>
                <div className="py-1 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setShowLogoutConfirm(true)
                      setShowDropdown(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation de déconnexion - Fond bleu clair flou */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-blue-100/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 border border-blue-200">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                <FaSignOutAlt className="text-2xl text-blue-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Confirmer la déconnexion
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir vous déconnecter de votre compte?
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar