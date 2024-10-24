import { CreateUserForm } from '../components/CreateUserForm'
import { useModal } from '../../../hooks/useModal';

export const UsersPage = () => {
    const { openModal } = useModal();

    return (
        <div className='container'>
            <h1 style={{ textAlign: "left" }}>Gestión Usuarios</h1>
            <p>Cree, borre y asigne los datos respectivos a cada usuario del sistema.</p>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", }}>
                <div style={{ textAlign: "left" }}>
                    <label>Buscar por número de cédula</label>
                    <div style={{ display: 'flex' }}>
                        <input type="text" placeholder='Ingrese número de cédula' />
                        <button>Buscar</button>
                    </div>
                </div>
                <button onClick={() => openModal(<CreateUserForm />)}>Open</button></div>
        </div>
    )
}
