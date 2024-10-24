import '../styles/NavbarPublic.css';
import { useNavigate } from 'react-router-dom';
import ByteDevLogo from '../../../assets/img/ByteDevLogo.png';
import { useAuth } from '../../../../src/hooks';  // Make sure this is your correct useAuth hook import
import { InfoPermissions } from '../../../constants/InfoPermissions';
import { DesktopNav } from './DesktopNav';
import { MobileNavbar } from './MobileNavbar';

export const NavbarPublic = () => {
    const { user, setToken, setUser } = useAuth();  // Get the token and user from useAuth hook
    const navigate = useNavigate();

    // Default permissions for non-authenticated users
    const defaultPermissions = ["regist", "login", "public-request", "heat-map"];

    // Use user permissions if available, otherwise default to guest permissions
    const permissionsToDisplay = user?.permissions || defaultPermissions;

    // Handle logout: clear token, clear user, and navigate to login
    const handleLogout = () => {
        setToken(null);  // Clear the token
        setUser(null);   // Clear the user state
        navigate('/');   // Redirect to home or login page
    };

    const findNavItems = () => {
        const items = [];
        permissionsToDisplay.map((permission) => {
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
