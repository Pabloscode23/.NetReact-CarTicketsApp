import { useAuth } from "../hooks";
import { InfoPermissions } from "../constants/InfoPermissions";
import { HomeCard } from "../modules/public/components/HomeCard";
import { RolePermissions } from "../constants/RolePermissions";
import { useEffect, useState } from "react";

// Default permissions for non-authenticated users
const defaultPermissions = ["regist", "login", "public-request", "heat-map"];

export const Dashboard = () => {
    const { user } = useAuth();
    const [userName, setUserName] = useState("");
    const [permissions, setPermissions] = useState(defaultPermissions);


    function capitalizeAndCut(inputString) {
        const cutString = inputString.split(' ')[0];

        const capitalizedString = cutString.charAt(0).toUpperCase() + cutString.slice(1).toLowerCase();

        return capitalizedString;
    }

    useEffect(() => {
        if (user) {
            setUserName(capitalizeAndCut(user.name));
            setPermissions(RolePermissions[user.role]);
        }
    }, [user]);


    return (
        <div className="container">
            <h1 className="main-title">Bienvenido(a) {userName}</h1>
            <h2 className="subtitle">Por favor seleccione lo que desea hacer</h2>

            <div className="cards">
                {permissions
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
