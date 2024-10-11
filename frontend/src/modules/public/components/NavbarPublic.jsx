import '../styles/NavbarPublic.css'
import { Link } from 'react-router-dom'
import ByteDevLogo from '../../../assets/img/ByteDevLogo.png'
const navPublicLinks = [
    {
        name: 'Inicio',
        route: '/'
    },
    {
        name: 'Registrarse',
        route: '/registro'
    },
    {
        name: 'Iniciar sesión',
        route: '/login'
    },
    {
        name: 'Consulta pública',
        route: '/*'
    },
    {
        name: 'Mapa de calor',
        route: '/mapa-de-calor'
    }
]
export const NavbarPublic = () => {
    const userRol = '';
    return (
        <nav className="navbar">
            <div className="navbar__logo-container">

                <img className="navbar__logo" src={ByteDevLogo} />
            </div>
            <div>
                <ul className="navbar__menu">

                    {
                        userRol === 'admin' && (
                            <>

                                <Link to="/user-manage"><li className="navbar__menu-item">Gestión de usuario</li></Link>
                                <Link to="/tickets"><li className="navbar__menu-item">Catálogo de multas</li></Link>
                                <Link to="/rol-permission"><li className="navbar__menu-item">Roles y permisos</li></Link>
                                <Link to="/reports"><li className="navbar__menu-item">Informes</li></Link>
                                <Link to="/plate-image"><li className="navbar__menu-item">Carga de imágenes</li></Link>
                                <Link to="/login"><li className="navbar__menu-item">Cerrar sesión</li></Link>

                            </>
                        )
                    }

                    {
                        userRol === 'judge' && (
                            <>

                                <Link to="/user-manage"><li className="navbar__menu-item">Juez</li></Link>
                                <Link to="/tickets"><li className="navbar__menu-item">Juez</li></Link>
                                <Link to="/rol-permission"><li className="navbar__menu-item">Juez</li></Link>
                                <Link to="/reports"><li className="navbar__menu-item">Juez</li></Link>
                                <Link to="/plate-image"><li className="navbar__menu-item">Juez</li></Link>
                                <Link to="/login"><li className="navbar__menu-item">Cerrar sesión</li></Link>

                            </>
                        )
                    }
                    {
                        userRol === 'officer' && (
                            <>

                                <Link to="/user-manage"><li className="navbar__menu-item">Oficial</li></Link>
                                <Link to="/tickets"><li className="navbar__menu-item">Oficial</li></Link>
                                <Link to="/rol-permission"><li className="navbar__menu-item">Oficial</li></Link>
                                <Link to="/reports"><li className="navbar__menu-item">Oficial</li></Link>
                                <Link to="/plate-image"><li className="navbar__menu-item">Oficial</li></Link>
                                <Link to="/login"><li className="navbar__menu-item">Cerrar sesión</li></Link>

                            </>
                        )
                    }
                    {
                        userRol === 'user' && (
                            <>
                                <Link to="/user-tickets"><li className="navbar__menu-item">Multas</li></Link>
                                <Link to="/claims"><li className="navbar__menu-item">Reclamos</li></Link>
                                <Link to="/userprofile-manage"><li className="navbar__menu-item">Gestionar cuenta</li></Link>
                                <Link to="/login"><li className="navbar__menu-item">Cerrar sesión</li></Link>

                            </>
                        )
                    }
                    {
                        userRol === '' && (
                            <>
                                <Link to="/"><li className="navbar__menu-item">Inicio</li></Link>
                                <Link to="/registro"><li className="navbar__menu-item">Registrarse</li></Link>
                                <Link to="/login"><li className="navbar__menu-item">Iniciar sesión</li></Link>
                                <Link to="*"><li className="navbar__menu-item">Consulta pública</li></Link>
                                <Link to="/mapa-de-calor"><li className="navbar__menu-item">Mapa de calor</li></Link>
                            </>
                        )
                    }


                </ul></div>
        </nav>
    )
}
