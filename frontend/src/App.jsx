
import './App.css'
import './reset.css'
import { AppRouter } from './router/AppRouter'
import { AuthProvider } from './contexts'


function App() {

  return (
    /* Proveedor del contexto de autenticacion. De esta manera tenemos acceso al token en toda la aplicacion */
    <AuthProvider>
      {/* Router que contiene el manejo de rutas */}
      <AppRouter />
    </AuthProvider>
  )
}

export default App
