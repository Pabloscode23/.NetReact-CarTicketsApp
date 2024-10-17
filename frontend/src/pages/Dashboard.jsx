import { useAuth } from "../hooks";
import { InfoPermissions } from "../constants/InfoPermissions";
import { HomeCard } from "../modules/public/components/HomeCard";

export const Dashboard = () => {
    const { user } = useAuth();

    // Default permissions for non-authenticated users
    const defaultPermissions = ["regist", "login", "public-request", "heat-map"];

    // Use user permissions if available, otherwise default to guest permissions
    const permissionsToDisplay = user?.permissions || defaultPermissions;

    return (
        <div className="container">
            <h1 className="main-title">Bienvenido(a)</h1>
            <h2 className="subtitle">Por favor seleccione lo que desea hacer</h2>

            <div className="cards">
                {permissionsToDisplay
                    .filter(permission => InfoPermissions[permission])  // Filter valid permissions
                    .map(permission => {
                        const permissionInfo = InfoPermissions[permission];
                        return (
                            <HomeCard
                                key={permission}
                                icon={permissionInfo.icon}
                                title={permissionInfo.title}
                                description={permissionInfo.description}
                                link={permissionInfo.link}
                            />
                        );
                    })}
            </div>
        </div>
    );
};
