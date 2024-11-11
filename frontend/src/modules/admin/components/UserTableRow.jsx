import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../../../constants/Api';
import { showSuccessAlert } from '../../../constants/Swal/SwalFunctions';


const tdStyle = {
    width: "20%"
}

export const UserTableRow = ({ user, onDelete, onEdit, }) => { // Añadido onEdit
    const { idNumber, name, email, role } = user;

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar a ${name}?`);
        if (confirmDelete) {
            try {
                await axios.delete(`${API_URL}/UserDTO/${idNumber}`);

                showSuccessAlert('Eliminación exitosa', `Usuario ${name} eliminado correctamente. Refresque la página para ver los cambios.`);


                onDelete(idNumber); // Llama a la función de callback para actualizar la lista de usuarios
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
            }
        }
    };

    return (
        <tr>
            <td style={tdStyle}>{idNumber}</td>
            <td style={tdStyle}>{name}</td>
            <td style={tdStyle}>{email}</td>
            <td style={tdStyle}>{role}</td>
            <td className='table__buttons' >
                <button
                    style={{ padding: "5px 10px" }}
                    onClick={() => onEdit(user)} // Abre el modal con los datos del usuario
                >
                    Editar
                </button>
                <button
                    style={{ padding: "5px 10px" }}
                    onClick={handleDelete}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    )
}

UserTableRow.propTypes = {
    user: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired // Asegúrate de pasar esta función desde el componente principal
}
