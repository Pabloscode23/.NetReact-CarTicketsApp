
import PropTypes from 'prop-types';

import { TicketsInfo } from '../../../constants/TicketsInfo';

export const TicketOfficer = ({ id, date, reason, amount, status, onEdit }) => {
    // Verificar si amount está disponible; si no lo está, tomarlo de TicketsInfo

    const buttonStyle = (disabled) => ({
        backgroundColor: disabled ? '#6C757D' : '', // Cambia el fondo a gris si está deshabilitado
        cursor: disabled ? 'not-allowed' : 'pointer', // Cambia el cursor a no permitido si está deshabilitado
    });
    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{date}</td>
            <td>{reason}</td>
            <td>{"₡" + amount}</td> {/* Muestra el amount real */}
            <td>{status}</td>
            <td className='table__buttons'>
                <button onClick={onEdit} disabled={status !== "Pendiente"}
                    style={buttonStyle(status !== "Pendiente")}
                >
                    Editar
                </button>
            </td>
        </tr>
    );
};



TicketOfficer.propTypes = {
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
};
