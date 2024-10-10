import '../styles/NavbarPublic.css'
import { Link } from 'react-router-dom'


export const NavbarPublic = () => {
    const ByteDevLogo = "/frontend/src/assets/ByteDevLogo.png"
    return (
        <nav className="navbar">
            <div className="navbar__logo-container">
                {/*TODO: Imagen no sirve */}
                <img className="navbar__logo" src={ByteDevLogo} />
            </div>
            <div>
                <ul className="navbar__menu">
                    <Link to="/"><li className="navbar__menu-item">Inicio</li></Link>
                    <Link to="/registro"><li className="navbar__menu-item">Registrarse</li></Link>
                    <Link to="/ingreso"><li className="navbar__menu-item">Iniciar sesión</li></Link>
                    {/*pagina de consulta publica, ruta */}
                    <Link to="*"><li className="navbar__menu-item">Consulta pública</li></Link>
                    <Link to="/mapa-de-calor"><li className="navbar__menu-item">Mapa de calor</li></Link>
                </ul></div>
        </nav>
    )
}
