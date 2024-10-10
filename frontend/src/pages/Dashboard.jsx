import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export const Dashboard = () => {
    // Para pruebas / maquetacion -> Se usa el custom hook para obtener la función setToken que asigna el token de autenticación
    const { setToken } = useAuth();
    const navigate = useNavigate();

    // Funcion para cerrar sesion durante pruebas y maquetacion
    const handleLogout = () => {
        setToken();
        navigate('/ingreso', { replace: true });
    }

    return (
        <>
            <h1>DASHBOARD</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </>
    )
}
