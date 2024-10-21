import { NavbarPublic } from "../modules/public/components/NavbarPublic"

// Componente de Layout principal de la pagina
export const MainLayout = ({ children }) => {
    return (
        <div className="main">
            <NavbarPublic />

            {/* MAIN */}
            <main>
                {children}
            </main>

            {/* FOOTER */}

        </div>
    )
}
