import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/';

// Componente que revisa los tokens de autenticación y redirige a la página de login si no hay token
export const ProtectedRoutes = () => {
    // Se obtiene el token de autenticación *esta comentado porque no se ha hecho el backend*
    const { token } = useAuth();

    // Si no hay token, redirige a la página de login *esta comentado porque no se ha hecho el backend*
    if (!token) {
        return <Navigate to={'/ingreso'} />
    }

    // Si hay token, muestra las rutas protegidas
    return <Outlet />
}
