// TicketUser.js
import PropTypes from 'prop-types';

export const TicketAdmin = ({ id, date, reason, amount, status, onEdit, onDelete }) => {
    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{date}</td>
            <td>{reason}</td>
            <td>₡{amount}</td>
            <td>{status}</td>
            <td className='table__buttons'>
                <button style={{ padding: "5px 5px" }} onClick={onEdit}>
                    Editar
                </button>
                <button style={{ padding: "5px 5px" }} onClick={onDelete}>Eliminar </button>
            </td>
        </tr>
    );
};

TicketAdmin.propTypes = {
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,

};
