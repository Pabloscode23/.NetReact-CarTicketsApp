import { Link } from "react-router-dom";
import { PropTypes } from 'prop-types';


export const DesktopNav = ({ ByteDevLogo, navItems, user, logout }) => {

    return (
        <nav className="navbar navbar-desktop">
            <div className="navbar__logo-container">
                <img className="navbar__logo" src={ByteDevLogo} alt="Logo" />
            </div>
            <div>
                <ul className="navbar__menu">
                    {/* Home / Dashboard Link */}
                    <Link to={'/'}>
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
                                    <span className='dropdown__listItem'>Más</span>


                                    <div className={`dropdown__content ${!user && 'dropdown__left'}`}>
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
                        <li className="navbar__menu-item" onClick={logout} style={{ cursor: 'pointer' }}>
                            Cerrar sesión
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}

DesktopNav.propTypes = {
    ByteDevLogo: PropTypes.string.isRequired,
    user: PropTypes.object,
    navItems: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired
}