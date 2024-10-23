import PropTypes from 'prop-types';

export const UserClaims = ({ id, date, reason, amount, status }) => {
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
UserClaims.propTypes = {
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onDispute: PropTypes.func.isRequired,
}