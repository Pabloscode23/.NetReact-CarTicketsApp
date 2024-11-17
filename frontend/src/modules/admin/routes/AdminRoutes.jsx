import { Route, Routes } from "react-router-dom"
import { UsersPage } from "../pages"
import { AdminAllTickets } from "../../tickets/pages/AdminAllTickets"
import UploadImagePage from "../../tickets/pages/UploadImagePage"

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
            <Route path="/multas" element={<AdminAllTickets />} />

            
            {/* Ruta para subir imagen */}
            <Route path="/imagen" element={<UploadImagePage />} />
        </Routes>
    )
}