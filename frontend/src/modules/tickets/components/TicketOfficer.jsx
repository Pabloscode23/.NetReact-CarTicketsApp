
import PropTypes from 'prop-types';

export const TicketOfficer = ({ id, date, reason, amount, status, onEdit }) => {
    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{date}</td>
            <td>{reason}</td>
            <td>{"₡" + amount}</td>
            <td>{status}</td>
            <td className='table__buttons'>
                {/* Deshabilitar el botón si el estado no es "Pendiente" */}
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
