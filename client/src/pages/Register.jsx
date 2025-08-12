import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const navigate = useNavigate();
  
  // États pour chaque champ du formulaire
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Construire l'objet d'adresse
      const address = { street, city, postalCode, country };
      
      // Envoyer la requête d'inscription
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, address, profileImage
      });
      
      // Notification de succès
      toast.success("Inscription réussie! Redirection...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        onClose: () => navigate('/login')
      });
      
      localStorage.setItem('authToken', response.data.token);
      
    } catch (error) {
      let errorMessage = "Erreur lors de l'inscription";
      if (error.response?.status === 409) errorMessage = "Email déjà utilisé";
      
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-sky-50 to-indigo-50 p-4">
      <ToastContainer />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-xl p-5 w-full max-w-md"
      >
        {/* En-tête ultra compact */}
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Employee Management
          </h1>
        </div>
        <p className="text-gray-500 text-xs text-center mb-4">Créer votre compte</p>

        {/* Formulaire ultra compact */}
        <form className="space-y-2" onSubmit={handleSubmit}>
          {/* Nom et Email sur une ligne */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[0.7rem] text-gray-600 mb-1">Nom complet</label>
              <input
                type="text"
                required
                placeholder="Votre nom"
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:outline-none"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-[0.7rem] text-gray-600 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="email@exemple.com"
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          {/* Mot de passe */}
          <div>
            <label className="block text-[0.7rem] text-gray-600 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {/* Adresse compacte */}
          <div className="bg-gray-50 rounded p-2">
            <h3 className="text-[0.7rem] font-medium text-gray-700 mb-1">Adresse</h3>
            
            <div className="space-y-1">
              <div>
                <label className="block text-[0.7rem] text-gray-600 mb-0.5">Rue</label>
                <input
                  type="text"
                  placeholder="Nom de rue"
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:outline-none"
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-1">
                <div>
                  <label className="block text-[0.7rem] text-gray-600 mb-0.5">Ville</label>
                  <input
                    type="text"
                    placeholder="Ville"
                    className="w-full px-1 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:outline-none"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-[0.7rem] text-gray-600 mb-0.5">Code postal</label>
                  <input
                    type="text"
                    placeholder="Code"
                    className="w-full px-1 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:outline-none"
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-[0.7rem] text-gray-600 mb-0.5">Pays</label>
                  <input
                    type="text"
                    placeholder="Pays"
                    className="w-full px-1 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:outline-none"
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Image de profil */}
          <div>
            <label className="block text-[0.7rem] text-gray-600 mb-1">
              URL image profil (optionnel)
            </label>
            <input
              type="text"
              placeholder="https://exemple.com/image.jpg"
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:outline-none"
              onChange={(e) => setProfileImage(e.target.value)}
            />
          </div>
          
          {/* Conditions en une ligne */}
          <div className="flex items-center mt-1">
            <input 
              type="checkbox" 
              id="terms" 
              className="h-2.5 w-2.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
              required
            />
            <label htmlFor="terms" className="ml-1.5 text-[0.65rem] text-gray-600">
              J'accepte les <a href="#" className="text-blue-600">Conditions</a> et <a href="#" className="text-blue-600">Politique</a>
            </label>
          </div>

          {/* Bouton d'inscription compact */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 text-[0.7rem] rounded-md mt-2 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inscription...
              </span>
            ) : (
              'Créer un compte'
            )}
          </motion.button>
        </form>

        {/* Lien de connexion compact */}
        <div className="mt-3 text-center">
          <p className="text-[0.65rem] text-gray-600">
            Déjà inscrit?{' '}
            <span 
              className="text-blue-600 font-medium cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;