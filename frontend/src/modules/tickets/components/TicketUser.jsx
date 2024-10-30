// TicketUser.js
import PropTypes from 'prop-types';

export const TicketUser = ({ id, date, reason, amount, status, onReclamar, isClaimed }) => {
    return (
        <tr>
            <td>{id}</td>
            <td>{date}</td>
            <td>{reason}</td>
            <td>{amount}</td>
            <td>{status}</td>
            <td className='table__buttons'>
                <button onClick={onReclamar} disabled={isClaimed}>Reclamar</button>
                <button>Pagar</button>
            </td>
        </tr>
    );
};

TicketUser.propTypes = {
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onReclamar: PropTypes.func.isRequired, // Cambiado a onReclamar
    isClaimed: PropTypes.bool.isRequired,
};
