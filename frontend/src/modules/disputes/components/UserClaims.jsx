import PropTypes from 'prop-types';

export const UserClaims = ({ id, date, reason, status }) => {
    return (
        <tr key={id}>
            <td>{id}</td>
            <td>{date}</td>
            <td>{reason}</td>
            <td>{status}</td>

        </tr>
    )
}
UserClaims.propTypes = {
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
}