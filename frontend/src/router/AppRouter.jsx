import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "../hooks";
import { routesForAuthenticatedOnly, routesForNonAuthenticatedOnly, routesForPublic } from "../constants/routes";


export const AppRouter = () => {
    // Se llama al token de autenticación
    const { token } = useAuth();

    // Se crea el router, lo que se esta haciendo es juntar todas las rutas en un mismo arreglo para poder ser usadas
    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNonAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ])

    return <RouterProvider router={router} />
}



