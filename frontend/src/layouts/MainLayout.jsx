import { NavbarPublic } from "../modules/public/components/NavbarPublic"

// Componente de Layout principal de la pagina
export const MainLayout = ({ children }) => {
    return (
        <>
            <NavbarPublic />

            {/* MAIN */}
            <main>
                {children}
            </main>

            {/* FOOTER */}

        </>
    )
}
