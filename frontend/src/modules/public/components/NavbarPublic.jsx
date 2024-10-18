import '../styles/NavbarPublic.css';
import { Link, useNavigate } from 'react-router-dom';
import ByteDevLogo from '../../../assets/img/ByteDevLogo.png';
import { useAuth } from '../../../../src/hooks';  // Make sure this is your correct useAuth hook import
import { InfoPermissions } from '../../../constants/InfoPermissions';

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

    // Dashboard link
    const dashboard = "/";

    const findNavItems = () => {
        const items = [];
        permissionsToDisplay.map((permission) => {
            items.push(InfoPermissions[permission]);
        });

        return items;
    };

    const navItems = findNavItems();

    console.log(navItems);


    return (
        <nav className="navbar">
            <div className="navbar__logo-container">
                <img className="navbar__logo" src={ByteDevLogo} alt="Logo" />
            </div>
            <div>
                <ul className="navbar__menu">
                    {/* Home / Dashboard Link */}
                    <Link to={dashboard}>
                        <li className="navbar__menu-item">Inicio</li>
                    </Link>

                    {/* Map permissions and render links */}
                    {navItems.slice(0, 2).map((item) => {

                        return (
                            <Link to={item.link} key={item.title}><li className="navbar__menu-item">{item.title}</li></Link>
                        );
                    })}
                    {
                        navItems.length > 2 && (
                            <li className="navbar__menu-item ">
                                <div className="dropdown">
                                    <li className='dropdown__listItem'>Más</li>


                                    <div className="dropdown__content">
                                        {navItems.slice(2).map((item) => {
                                            return (
                                                <Link className='dropdown__content-link' to={item.link} key={item.title}>{item.title}</Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </li>
                        )

                    }

                    {/* Show "Cerrar sesión" only if the user is logged in */}
                    {user && user.name !== "Guest" && (
                        <li className="navbar__menu-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            Cerrar sesión
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};
