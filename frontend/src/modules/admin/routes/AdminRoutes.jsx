import { Route, Routes } from "react-router-dom"
import { UsersPage } from "../pages"

export const AdminRoutes = () => {
    return (
        // Rutas para el módulo de tickets
        <Routes>
            {/* Ruta para CRUD de Roles y Permisos (Solo se pueden hacer roles, los permisos son default) */}
            <Route path="/roles" element={<h1>Roles</h1>} />

            {/* Ruta para CRUD de Usuarios */}
            <Route path="/usuarios" element={<UsersPage />} />

            {/* Ruta para control de informes */}
            <Route path="/informes" element={<h1>Reports</h1>} />

            {/* Ruta para control de pagos */}
            <Route path="/pagos" element={<h1>Payments</h1>} />

        </Routes>
    )
}