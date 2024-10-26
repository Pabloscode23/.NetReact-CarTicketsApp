import { Link } from "react-router-dom";
import { PropTypes } from 'prop-types';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export const MobileNavbar = ({ ByteDevLogo, navItems, user, logout }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleOpenMenu = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <>
            <nav className="navbar navbar-mobile">
                <div className="navbar__logo-container">
                    <img className="navbar__logo" src={ByteDevLogo} alt="Logo" />
                </div>
                <div onClick={handleOpenMenu}>
                    <FontAwesomeIcon icon={faBars} size="2x" color='var(--color-blue-dark)' />
                </div>
            </nav>
            <div>
                <div className={`navbar-mobile_content ${menuOpen && "active"}`}>
                    <ul className="navbar__menu">
                        <Link to={'/'}>
                            <li className="navbar__menu-item">Inicio</li>
                        </Link>
                        {navItems.map((item) => {
                            return (
                                <Link to={item.link} key={item.title}><li className="navbar__menu-item">{item.title}</li></Link>
                            );
                        })}
                        {user && user.name !== "Guest" && (
                            <li className="navbar__menu-item" onClick={logout} style={{ cursor: 'pointer' }}>
                                Cerrar sesión
                            </li>
                        )}
                    </ul>
                    <FontAwesomeIcon onClick={handleOpenMenu} icon={faXmark} size="1x" color='#fff' style={{ marginTop: "50px" }} />
                </div>
            </div>
        </>
    )
}

MobileNavbar.propTypes = {
    ByteDevLogo: PropTypes.string.isRequired,
    user: PropTypes.object,
    navItems: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired
}