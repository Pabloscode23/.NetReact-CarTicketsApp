import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks"

export const Login = () => {
    // Se usa el custom hook para obtener la función setToken que asigna el token de autenticación
    const { setToken } = useAuth();

    // Se usa el hook de navegación para redirigir a la página principal
    const navigate = useNavigate();

    // Función que se ejecuta al hacer click en el botón de login
    const handleLogin = () => {
        setToken('token de prueba');
        navigate('/', { replace: true });
    }

    return (
        <>
            <h1>LOGIN</h1>
            <button onClick={handleLogin}>Ingreso</button>
        </>
    )
}
