import PropTypes from 'prop-types';

export const TicketUser = ({ id, date, reason, amount, status, onDispute }) => {
    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{date}</td>
            <td>{reason}</td>
            <td>{"₡" + amount}</td>
            <td>{status}</td>
            <td className='table__buttons'>
                <button>Pagar</button> {/* Debe de redirigir a la pagina de pago*/}
                <button onClick={onDispute}>Reclamar</button>
            </td>
        </tr>
    )
}
TicketUser.propTypes = {
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onDispute: PropTypes.func.isRequired,
}