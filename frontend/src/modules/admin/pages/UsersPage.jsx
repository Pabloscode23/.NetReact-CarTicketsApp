import { CreateUserForm } from '../components/CreateUserForm'
import { useModal } from '../../../hooks/useModal';
import { GlobalTable } from '../../../components';
import { useEffect, useState } from 'react';
import { UserTableRow } from '../components';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const columns = ['Cédula', 'Nombre', 'Apellidos', 'Tipo de Usuario', ''];


const tempUsers = [
    {
        id: 1,
        idNumber: '123456789',
        firstName: 'Juan',
        lastName: 'Perez',
        role: 'Administrador'
    },
    {
        id: 2,
        idNumber: '987654321',
        firstName: 'Maria',
        lastName: 'Gonzalez',
        role: 'Usuario'
    }
]


export const UsersPage = () => {
    const { openModal } = useModal();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([])
    const [isFiltered, setIsFiltered] = useState(false)

    const handleFilter = (e) => {
        e.preventDefault();
        setFilteredUsers(filterUsers(e.target[0].value))
        setIsFiltered(true)
    }

    useEffect(() => {

        if (users.length === 0) {
            setUsers(tempUsers)
            setFilteredUsers(tempUsers)
        }


    }, [users])


    const filterUsers = (idNumber) => {
        return users.filter(user => user.idNumber.toLowerCase().includes(idNumber.toLowerCase()))
    }

    const resetFilter = () => {
        setFilteredUsers(users)
        setIsFiltered(false)
    }

    return (
        <>
            <h1 style={{ textAlign: "left" }}>Gestión Usuarios</h1>
            <p>Cree, borre y asigne los datos respectivos a cada usuario del sistema.</p>
            <div style={{ width: "100%" }}>
                <div style={{ textAlign: "left", width: "80%", margin: "0 auto", display: 'flex', flexDirection: "column", gap: "10px" }}>
                    <label>Buscar por número de cédula</label>
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                        <form onSubmit={handleFilter} style={{ display: 'flex', minWidth: "50%" }}>
                            <input className='default__input' style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} type="text" placeholder='Ingrese número de cédula' />
                            {
                                isFiltered && <button onClick={resetFilter} className='default__button' style={{ borderRadius: "0px", width: "10%" }}><FontAwesomeIcon icon={faRotateRight} /></button>
                            }
                            <button type='submit' className='default__button' style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0, width: "20%" }}>Buscar</button>
                        </form>
                        <button className='default__button' onClick={() => openModal(<CreateUserForm />)}>Agregar Usuario Nuevo</button>
                    </div>
                    {
                        filteredUsers.length === 0 ? <p>No hay resultados</p> :
                            <GlobalTable columns={columns}>
                                {filteredUsers.map((user) => (
                                    <UserTableRow key={user.id} user={user} />
                                )
                                )}
                            </GlobalTable>
                    }

                </div>
            </div>

        </>
    )
}
