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
import { ForgotPasswordPage } from "../modules/auth/pages/ForgotPasswordPage"
import { PublicResquestPage } from "../modules/public/pages/PublicRequestPage"
import { AllUserTicketsPage } from "../modules/tickets/pages/AllUserTicketsPage"
import { UserClaimsPage } from "../modules/disputes/pages/UserClaimsPage"
import { RegistUpdateFinalUser } from "../modules/public/pages/RegistUpdateFinalUserPage"
import { ChangePasswordPage } from "../modules/auth/pages/ChangePasswordPage";
import UploadImagePage from "../modules/tickets/pages/UploadImagePage";
import { AuthProvider } from "../contexts"

import { TicketsProvider } from "../modules/tickets/context/TicketsProvider"

import { TicketsContext } from "../modules/tickets/context/TicketsContext"
import { JudgeResolveClaimsPage } from "../modules/judge/pages/JudgeResolveClaimsPage"

// Rutas publicas
export const routesForPublic = [
    {
        path: "/registro",
        element: <MainLayout><RegistFinalUser /></MainLayout>
    },
    {
        path: "/mapa-de-calor",
        element: <MainLayout><h1>HEATMAP</h1></MainLayout>
    },
    {
        path: "/consulta-publica",
        element: <MainLayout><PublicResquestPage /></MainLayout>
    },
    {
        path: "/olvide-contrasena",
        element: <MainLayout><ForgotPasswordPage /></MainLayout>
    },
    {
        path: "/cambiar-contrasena",
        element: <MainLayout><ChangePasswordPage /></MainLayout>
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
                path: "/juez-reclamos",
                element: <JudgeResolveClaimsPage/>
            },
            {
                path: "/gestion/*",
                element: <AdminRoutes />
            },
            {
                path: "/caja-de-pago",
                element: <h1>Caja de pago</h1>
            }, {
                path: "/multas-usuario",

                element: <TicketsProvider> <AllUserTicketsPage /></TicketsProvider>

            }, {
                path: "/reclamos-usuario",
                element: <UserClaimsPage />
            },
            {
                path: "/perfil",
                element: <RegistUpdateFinalUser />
            },
            {
                path: "/imagen",
                element: <UploadImagePage />
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
        element: <MainLayout><LoginPage /></MainLayout>
    }, {
        path: "/two-factor",
        element: <MainLayout><TwoFactorPage /></MainLayout>
    },
]