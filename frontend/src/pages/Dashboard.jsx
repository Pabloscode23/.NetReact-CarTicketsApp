import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { cardsAdminInfo } from "../modules/admin/components/AdminCardsInfo";
import { HomeCard } from "../modules/public/components/HomeCard";
import { RequirePermission } from "../modules/auth/components/RequirePermission";
import { Permissions } from "../constants";

export const Dashboard = () => {
    // Para pruebas / maquetacion -> Se usa el custom hook para obtener la función setToken que asigna el token de autenticación
    const { setToken, setUser, user } = useAuth();
    const navigate = useNavigate();
    console.log(user);

    // Funcion para cerrar sesion durante pruebas y maquetacion
    const handleLogout = () => {
        setToken();
        setUser();
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


            <RequirePermission permission={Permissions.create_users}>
                <h2>Perfil</h2>
                <p style={{ color: "black" }}>En esta sección puedes ver tu perfil</p>
            </RequirePermission>
            <RequirePermission permission={Permissions.view_payments}>
                <h2>Perfil</h2>
                <p style={{ color: "black" }}>En esta sección puedes ver pagos</p>
            </RequirePermission>

            <button style={{ marginTop: "100px" }} onClick={handleLogout}>Cerrar sesión</button>
        </div>
    )
}
