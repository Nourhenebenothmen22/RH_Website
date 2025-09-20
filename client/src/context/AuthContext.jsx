// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';

// Créez et exportez le contexte
export const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider =({ children })=>{
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userItemType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userProfileImage');
    setUser(null);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      const itemtype = localStorage.getItem('userItemType');
      const name = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');
      const profileImage = localStorage.getItem('userProfileImage');
      
      if (token && itemtype && name) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.user.itemtype.toLowerCase() !== itemtype.toLowerCase()) {
            console.warn("User type inconsistency detected");
            logout();
            return;
          }

          setUser({
            token,
            itemtype: response.data.user.itemtype,
            name: response.data.user.name,
            email: response.data.user.email,
            id: response.data.user.id || userId,
            profileImage: response.data.user.profileImage || profileImage
          });
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [logout]);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userItemType', userData.itemtype);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userProfileImage', userData.profileImage || '');
    
    setUser({
      token,
      ...userData
    });
  };

  const isAuthenticated = () => !!user;
  const isAdmin = () => user?.itemtype?.toLowerCase() === 'admin';
  const isEmployee = () => user?.itemtype?.toLowerCase() === 'employee';

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isEmployee
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}