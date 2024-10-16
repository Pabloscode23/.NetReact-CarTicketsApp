import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { InfoPermissions } from "../constants/InfoPermissions";
import { HomeCard } from "../modules/public/components/HomeCard";
import { RequirePermission } from "../modules/auth/components/RequirePermission";

export const Dashboard = () => {
    const { setToken, setUser, user } = useAuth();
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
        setToken();
        setUser();
        navigate('/', { replace: true });
    }

    return (
        <div className="container">
            <h1 className="main-title">Bienvenido(a)</h1>
            <h2 className="subtitle">Por favor seleccione lo que desea hacer</h2>

            <div className="cards">
                {Object.keys(InfoPermissions)
                    .filter(permission => user?.permissions.includes(permission))
                    .map((permissionKey, index) => {
                        const permission = InfoPermissions[permissionKey];
                        return (
                            <HomeCard
                                key={index}
                                icon={permission.icon}
                                title={permission.title}
                                description={permission.description}
                                link={permission.link}
                            />
                        );
                    })}
            </div>

            <button style={{ marginTop: "100px" }} onClick={handleLogout}>
                Cerrar sesión
            </button>
        </div>
    );
};
