import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { cardsAdminInfo } from "../modules/admin/components/AdminCardsInfo";
import { HomeCard } from "../modules/public/components/HomeCard";

export const Dashboard = () => {
    // Para pruebas / maquetacion -> Se usa el custom hook para obtener la función setToken que asigna el token de autenticación
    const { setToken } = useAuth();
    const navigate = useNavigate();

    // Funcion para cerrar sesion durante pruebas y maquetacion
    const handleLogout = () => {
        setToken();
        navigate('/login', { replace: true });
    }

    return (
        <div className="container">
            <h1 className="main-title">Bienvenido(a)</h1>
            <h2 className="subtitle">Por favor seleccione lo que desea hacer</h2>
            <div className="cards">
                {cardsAdminInfo.map((card, index) => (
                    <HomeCard key={index} icon={card.icon} title={card.title} description={card.description} link={card.link} />
                ))}
            </div>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    )
}
