import { Route, Routes } from "react-router-dom"

export const TicketsRoutes = () => {
    return (
        // Rutas para el módulo de tickets
        <Routes>
            {/* Ruta de inicio de oficial - Solo puede visualizar sus Multas hechas */}
            <Route path="/" element={<h1>Tickets</h1>} />

            {/* Ruta para ir a formulario de creacion de multa - RESPONSIVE */}
            <Route path="/crear" element={<h1>Create</h1>} />

            {/* Ruta para ir a formulario de edicion de multa - RESPONSIVE */}
            <Route path="/editar/:id" element={<h1>Edit</h1>} />

            {/* Ruta para crear tipos de multas */}
            <Route path="/tipos" element={<h1>Types</h1>} />

            {/* Ruta para ingresar datos en el lector de imagenes */}
            <Route path="/lector-imagenes" element={<h1>Reader</h1>} />
        </Routes>
    )
}