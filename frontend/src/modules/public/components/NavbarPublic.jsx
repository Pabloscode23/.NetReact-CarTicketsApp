import '../styles/NavbarPublic.css';
import { useNavigate } from 'react-router-dom';
import ByteDevLogo from '../../../assets/img/ByteDevLogo.png';
import { useAuth } from '../../../../src/hooks';  // Make sure this is your correct useAuth hook import
import { InfoPermissions } from '../../../constants/InfoPermissions';
import { DesktopNav } from './DesktopNav';
import { MobileNavbar } from './MobileNavbar';
import { useEffect, useState } from 'react';
import { RolePermissions } from '../../../constants/RolePermissions';
// Default permissions for non-authenticated users
const defaultPermissions = ["regist", "login", "public-request", "heat-map"];


export const NavbarPublic = () => {
    const { user, setToken, setUser } = useAuth();  // Get the token and user from useAuth hook
    const [permissions, setPermissions] = useState(defaultPermissions);
    const navigate = useNavigate();

    useEffect(() => {
        {
            if (user) {
                setPermissions(RolePermissions[user.role]);
            }
        }
    }, [user]);

    // Handle logout: clear token, clear user, and navigate to login
    const handleLogout = () => {
        setToken(null);  // Clear the token
        setUser(null);   // Clear the user state
        navigate('/');   // Redirect to home or login page
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
