import { CreateUserForm } from '../components/CreateUserForm';
import { useModal } from '../../../hooks/useModal';
import { GlobalTable } from '../../../components';
import { useEffect, useState, useRef } from 'react';
import { UserTableRow } from '../components';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URL } from '../../../constants/Api';
import axios from 'axios';
import EditUserForm from '../../public/components/EditUserForm'// Importa tu componente para editar usuarios

const columns = ['Cédula', 'Nombre', 'Correo electrónico', 'Tipo de Usuario', 'Acciones'];

export const UsersPage = () => {

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const searchInputRef = useRef(null); // referencia al input de búsqueda

    const { openModal, closeModal } = useModal(); // include closeModal

    // Open the CreateUserForm and pass the closeModal function as a prop
    const handleOpenCreateUserForm = () => {
        openModal(<CreateUserForm closeModal={closeModal} />);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();
        if (searchTerm) {
            setFilteredUsers(filterUsers(searchTerm));
            setIsFiltered(true);
        } else {
            resetFilter();
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/UserDTO`);
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error("Error al cargar los usuarios:", error);
            }
        };

        fetchUsers();
    }, []);

    const filterUsers = (searchTerm) => {
        return users.filter(user =>
            user.idNumber?.toLowerCase().includes(searchTerm) ||
            user.name?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm) ||
            user.role?.toLowerCase().includes(searchTerm)
        );
    };

    const resetFilter = () => {
        setFilteredUsers(users);
        setIsFiltered(false);
        if (searchInputRef.current) {
            searchInputRef.current.value = ""; // limpia el input de búsqueda
        }
    };

    const handleEditUser = (user) => {
        openModal(<EditUserForm user={user} onUserUpdated={handleUserUpdated} closeModal={closeModal} />); // Abre el modal de edición con el usuario
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${API_URL}/UserDTO/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const handleUserUpdated = (updatedUser) => {
        setUsers(users.map(user => (user.idNumber === updatedUser.idNumber ? updatedUser : user)));
        setFilteredUsers(filteredUsers.map(user => (user.idNumber === updatedUser.idNumber ? updatedUser : user)));
    };

    return (
        <div className='container__tickets'>
            <h1 className="main__ticket-title" style={{ textAlign: "left" }}>Gestión de usuarios</h1>
            <h2 className="main__ticket-subtitle"> Cree, borre y asigne los datos respectivos a cada usuario del sistema.</h2>
            <div style={{ width: "100%" }}>
                <div style={{ textAlign: "left", width: "80%", margin: "0 auto", display: 'flex', flexDirection: "column", gap: "10px" }}>
                    <label style={{ color: "#2E8EB1" }}>Buscar por cédula, nombre, apellidos, correo electrónico o rol</label>
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                        <form onSubmit={handleFilter} style={{ display: 'flex', minWidth: "50%" }}>
                            <input
                                ref={searchInputRef} // asigna la referencia al input
                                className='default__input'
                                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                type="text"
                                placeholder='Ingrese término de búsqueda'
                            />
                            {
                                isFiltered && <button onClick={resetFilter} className='default__button' style={{ borderRadius: "0px", width: "10%" }}><FontAwesomeIcon icon={faRotateRight} /></button>
                            }
                            <button type='submit' className='default__button' style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0, width: "20%" }}>Buscar</button>
                        </form>
                        <button className='default__button' onClick={handleOpenCreateUserForm}>Agregar usuario nuevo</button>
                    </div>
                    {
                        filteredUsers.length === 0 ? <p>No hay resultados</p> :
                            <GlobalTable columns={columns}>
                                {filteredUsers.map((user) => (
                                    <UserTableRow
                                        key={user.id}
                                        user={user}
                                        onDelete={handleDeleteUser}
                                        onEdit={handleEditUser} // Pasar la función onEdit

                                    />
                                ))}
                            </GlobalTable>
                    }
                </div>
            </div>
        </div>
    );
};
