
import PropTypes from 'prop-types';

import { TicketsInfo } from '../../../constants/TicketsInfo';

export const TicketOfficer = ({ id, date, reason, amount, status, onEdit }) => {
    // Verificar si amount está disponible; si no lo está, tomarlo de TicketsInfo
    const displayAmount = amount !== undefined ? amount : TicketsInfo[reason] || 0;

    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{date}</td>
            <td>{reason}</td>
            <td>{"₡" + displayAmount}</td> {/* Muestra el amount real */}
            <td>{status}</td>
            <td className='table__buttons'>
                <button onClick={onEdit} disabled={status !== "Pendiente"}>
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
