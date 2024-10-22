import { NavbarPublic } from "../modules/public/components/NavbarPublic"

// Componente de Layout principal de la pagina
export const MainLayout = ({ children }) => {
    return (
        <div >
            <NavbarPublic />

            {/* MAIN */}
            <main className="container">
                {children}
            </main>

            {/* FOOTER */}

        </div>
    )
}
