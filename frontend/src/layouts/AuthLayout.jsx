import { NavbarPublic } from "../modules/public/components/NavbarPublic"

// Desc: Layout para las rutas de autenticación - no deberia de tener navegación
export const AuthLayout = ({ children }) => {
    return (
        <>
            <NavbarPublic />
            {children}
        </>
    )
}
