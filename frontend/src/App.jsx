
import './App.css'
import { AppRouter } from './router/AppRouter'
import { AuthProvider, ModalProvider } from './contexts'


function App() {

  return (
    /* Proveedor del contexto de autenticacion. De esta manera tenemos acceso al token en toda la aplicacion */
    <AuthProvider>
      <ModalProvider>
        {/* Router que contiene el manejo de rutas */}
        <AppRouter />
      </ModalProvider>

    </AuthProvider>
  )
}

export default App
