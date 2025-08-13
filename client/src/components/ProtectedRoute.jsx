import { useContext, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      const userRole = user.itemtype?.toLowerCase() || 'default';
      
      // Si l'utilisateur tente d'accéder à une page non autorisée
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Déconnecter l'utilisateur et rediriger vers le login
        logout();
        navigate('/login', { 
          state: { 
            from: location,
            error: "Accès non autorisé. Vous avez été déconnecté."
          },
          replace: true 
        });
      }
    }
  }, [user, isLoading, allowedRoles, navigate, location, logout]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Non authentifié - redirection vers login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification du rôle (gestion des utilisateurs sans itemtype)
  const userRole = user.itemtype?.toLowerCase() || 'default';
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  // Rôle autorisé - accès à la page
  if (hasRequiredRole) {
    return children;
  }

  // Cas où l'utilisateur n'a pas les droits mais est encore connecté
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default ProtectedRoute;