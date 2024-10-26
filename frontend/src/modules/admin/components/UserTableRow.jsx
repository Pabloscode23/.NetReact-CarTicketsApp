import PropTypes from 'prop-types';

const tdStyle = {
    width: "20%"
}

export const UserTableRow = ({ user }) => {

    const { idNumber, firstName, lastName, role } = user;


    return (
        <tr>
            <td style={tdStyle}>{idNumber}</td>
            <td style={tdStyle}>{firstName}</td>
            <td style={tdStyle}>{lastName}</td>
            <td style={tdStyle}>{role}</td>
            <td className='table__buttons' style={{ justifyContent: "end", gap: "10px", padding: "10px 0" }}>
                <button style={{ maxWidth: "100px", padding: "10px 0" }}>Editar Usuario</button>
                <button style={{ maxWidth: "100px", padding: "10px 0" }}>Eliminar Usuario</button>
            </td>
        </tr>
    )
}


UserTableRow.propTypes = {
    user: PropTypes.object.isRequired
}