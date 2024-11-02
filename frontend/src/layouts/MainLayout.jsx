import { useAuth } from "../hooks";
import { NavbarPublic } from "../modules/public/components/NavbarPublic"

// Componente de Layout principal de la pagina
export const MainLayout = ({ children }) => {
    const { user, token } = useAuth();

    return (
        <div >
            <NavbarPublic />

            {/* MAIN */}
            <main className="container">
                {token && user ? children : token && !user ? <h3>Cargando</h3> : children}
            </main>

            {/* FOOTER */}

        </div>
    )
}
