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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Construire l'objet d'adresse
      const address = {
        street,
        city,
        postalCode,
        country
      };
      
      // Envoyer la requête d'inscription
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        address,
        profileImage
      });
      console.log("Réponse reçue :", response.data);
      
      // Notification de succès
      toast.success("Inscription réussie! Redirection en cours...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
         onClose: () => navigate('/login')
      });
       localStorage.setItem('authToken', response.data.token);
      
     
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      
      // Gestion spécifique des erreurs
      let errorMessage = "Une erreur s'est produite lors de l'inscription";
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "Cet email est déjà utilisé";
        } else if (error.response.status === 400) {
          errorMessage = "Données invalides";
        }
      }
      
      // Notification d'erreur
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-600 p-4 py-8">
      <ToastContainer />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-xl p-5 w-full max-w-md"
      >
        {/* En-tête avec icône animée */}
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col items-center mb-3"
        >
          <motion.div 
            animate={{ 
              rotate: [0, 3, -3, 0],
              y: [0, -3, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 rounded-full shadow-md mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </motion.div>
          
          <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
            Employee Management
          </h1>
          <p className="text-gray-500 text-center text-xs">Créez votre compte</p>
        </motion.div>

        {/* Formulaire compact */}
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-2">
            {/* Champ Nom */}
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 text-xs">Nom complet</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Votre nom complet"
                  className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-400 focus:outline-none transition-all"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Champ Email */}
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 text-xs">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-400 focus:outline-none transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 text-xs">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-8 pr-8 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-400 focus:outline-none transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Section Adresse compacte */}
            <div className="space-y-1">
              <h3 className="font-medium text-gray-700 text-xs mb-1">Adresse</h3>
              
              {/* Rue */}
              <div className="relative mb-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rue"
                  className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-400 focus:outline-none transition-all"
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                {/* Ville */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ville"
                    className="w-full pl-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-400 focus:outline-none transition-all"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                
                {/* Code postal */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Code postal"
                    className="w-full pl-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-400 focus:outline-none transition-all"
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Pays */}
              <div className="relative mt-1">
                <input
                  type="text"
                  placeholder="Pays"
                  className="w-full pl-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-400 focus:outline-none transition-all"
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            {/* Image de profil */}
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 text-xs">
                URL image profil (optionnel)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-400 focus:outline-none transition-all"
                  onChange={(e) => setProfileImage(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Bouton avec effet dégradé */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 text-xs rounded transition-all duration-200 shadow ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

        {/* Séparateur */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-[0.65rem] text-gray-500">Déjà inscrit?</span>
          </div>
        </div>

        {/* Bouton de connexion */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/login')}
          className="flex items-center justify-center w-full border border-blue-500 text-blue-500 hover:bg-blue-50 font-medium py-2 text-xs rounded transition-all duration-200"
        >
          Se connecter
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>

        {/* Mentions légales */}
        <p className="mt-2 text-center text-[0.6rem] text-gray-500">
          En vous inscrivant, vous acceptez nos <a href="#" className="text-blue-500 hover:underline">Conditions</a> et notre <a href="#" className="text-blue-500 hover:underline">Politique</a>.
        </p>
      </motion.div>
    </div>
  );
}

export default Register;