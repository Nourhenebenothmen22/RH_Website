// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userItemType');
    localStorage.removeItem('userName');
    setUser(null);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      const itemtype = localStorage.getItem('userItemType');
      const name = localStorage.getItem('userName');
      
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
            id: response.data.user.id
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
    
    setUser({
      token,
      ...userData
    });
  };

  const isAuthenticated = () => !!user;
  const isAdmin = () => user?.itemtype?.toLowerCase() === 'admin';
  const isEmployee = () => user?.itemtype?.toLowerCase() === 'employee';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isEmployee
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}