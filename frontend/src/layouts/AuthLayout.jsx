import { NavbarPublic } from "../modules/public/components/NavbarPublic"
import "../styles/AuthLayout.css"
// Desc: Layout para las rutas de autenticación - no deberia de tener navegación
export const AuthLayout = ({ children }) => {
    return (
        <div className="auth__container">
            <NavbarPublic />
            {children}
        </div>
    )
}
