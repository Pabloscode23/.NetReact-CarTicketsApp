import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../../../constants/Api'; // Asegúrate de que el archivo tenga el URL base correcto

const tdStyle = {
    width: "20%"
}

export const UserTableRow = ({ user, onDelete }) => {
    const { idNumber, name, email, role } = user;

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar a ${name}?`);
        if (confirmDelete) {
            try {
                await axios.delete(`${API_URL}/UserDTO/${idNumber}`);
                alert(`Usuario ${name} eliminado correctamente. Refresque la página para ver los cambios.`);
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
            <td className='table__buttons' style={{ justifyContent: "end", gap: "10px", padding: "10px 0" }}>
                <button style={{ maxWidth: "100px", padding: "10px 0" }}>Editar Usuario</button>
                <button
                    style={{ maxWidth: "100px", padding: "10px 0" }}
                    onClick={handleDelete}
                >
                    Eliminar Usuario
                </button>
            </td>
        </tr>
    )
}

UserTableRow.propTypes = {
    user: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired // Asegúrate de pasar esta función desde el componente principal
}
