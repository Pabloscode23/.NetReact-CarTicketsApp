import PropTypes from 'prop-types';

export const TicketOfficer = ({ id, date, reason, amount, status }) => {
    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{date}</td>
            <td>{reason}</td>
            <td>{"₡" + amount}</td>
            <td>{status}</td>
        </tr>
    )
}

TicketOfficer.propTypes = {
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onDispute: PropTypes.func.isRequired,
    isClaimed: PropTypes.bool.isRequired, // Add prop type for isClaimed
};
