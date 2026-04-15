import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Cargando...</p>;

    // Si no hay usuario, al login
    if (!user) return <Navigate to="/login" />;

    // Si el usuario no tiene el rol necesario, a una página de "No autorizado" o al inicio
    const hasRole = user.roles.some(role => allowedRoles.includes(role.name));
    
    if (!hasRole) return <Navigate to="/" />;

    return children;
};