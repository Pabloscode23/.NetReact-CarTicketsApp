import '../styles/NavbarPublic.css';
import { useNavigate } from 'react-router-dom';
import ByteDevLogo from '../../../assets/img/ByteDevLogo.png';
import { useAuth } from '../../../../src/hooks';  // Asegúrate de que este es el hook correcto
import { InfoPermissions } from '../../../constants/InfoPermissions';
import { DesktopNav } from './DesktopNav';
import { MobileNavbar } from './MobileNavbar';
import { useEffect, useState } from 'react';
import { RolePermissions } from '../../../constants/RolePermissions';

// Default permissions for non-authenticated users
const defaultPermissions = ["regist", "login", "public-request", "heat-map"];

export const NavbarPublic = () => {
    const { user, setToken, setUser } = useAuth();  // Obtener el token y usuario del hook useAuth
    const [permissions, setPermissions] = useState(defaultPermissions);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setPermissions(RolePermissions[user.role] || defaultPermissions);  // Asegúrate de que si no existe el rol, se utilicen los permisos por defecto
        } else {
            setPermissions(defaultPermissions);  // Restablecer permisos cuando el usuario esté deslogueado
        }
    }, [user]);  // Dependemos del estado 'user', por lo que se actualizará cuando cambie

    // Manejar logout: borrar token, usuario y redirigir
    const handleLogout = () => {
        setToken(null);  // Limpiar el token
        setUser(null);   // Limpiar el usuario
        navigate('/');   // Redirigir a la página de inicio o login
    };

    const findNavItems = () => {
        const items = [];
        permissions.map((permission) => {
            items.push(InfoPermissions[permission]);
        });

        return items;
    };

    const navItems = findNavItems();

    return (
        <>
            <DesktopNav navItems={navItems} ByteDevLogo={ByteDevLogo} user={user} logout={handleLogout} />
            <MobileNavbar navItems={navItems} ByteDevLogo={ByteDevLogo} user={user} logout={handleLogout} />
        </>
    );
};
