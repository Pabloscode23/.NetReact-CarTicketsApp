import { HomePublic } from "../modules/public/pages/HomePublicPage"
import { MainLayout } from "../layouts"
import { AuthLayout } from "../layouts/AuthLayout"
import { AdminRoutes } from "../modules/admin/routes/"
import { LoginPage } from "../modules/auth/pages"
import { TicketsRoutes } from "../modules/tickets/routes/"
import { Dashboard, NotFound } from "../pages"
import { ProtectedRoutes } from "../router"
import { RegistFinalUser } from "../modules/public/pages/RegistFinalUserPage"
import { TwoFactorPage } from "../modules/auth/pages/TwoFactorPage"



// Rutas publicas
export const routesForPublic = [
    {
        path: "/registro",
        element: <AuthLayout><RegistFinalUser /></AuthLayout>
    },
    {
        path: "/mapa-de-calor",
        element: <MainLayout><h1>HEATMAP</h1></MainLayout>
    },
    {
        path: "/consulta-placa",
        element: <MainLayout><h1>PLATE SEARCH</h1></MainLayout>
    },
    {
        path: "/olvide-contrasena",
        element: <AuthLayout><h1>PASSWORD RECOVERY</h1></AuthLayout>
    },
    {
        path: "/cambiar-contrasena/:token",
        element: <AuthLayout><h1>PASSWORD CHANGE</h1></AuthLayout>
    },
    {
        path: "*",
        element: <NotFound />
    }
]

// Rutas privadas
export const routesForAuthenticatedOnly = [
    {
        path: '/',
        element: <MainLayout><ProtectedRoutes /></MainLayout>,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/multas/*",
                element: <TicketsRoutes />
            },
            {
                path: "/reclamos",
                element: <h1>CLAIMS</h1>
            },
            {
                path: "/gestion/*",
                element: <AdminRoutes />
            },
            {
                path: "/perfil",
                element: <h1>PROFILE</h1>
            },
            {
                path: "/caja-de-pago",
                element: <h1>Caja de pago</h1>
            }
        ]
    }
]

// Rutas solo para usuarios no autenticados
export const routesForNonAuthenticatedOnly = [
    {
        path: "/",
        element: <MainLayout>
            <HomePublic />
        </MainLayout>
    },
    {
        path: "/login",
        element: <AuthLayout><LoginPage /></AuthLayout>
    }, {
        path: "/two-factor",
        element: <AuthLayout><TwoFactorPage /></AuthLayout>
    },
]