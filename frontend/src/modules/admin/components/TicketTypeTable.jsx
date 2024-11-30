

export const TicketTypeTable = ({ ticketType }) => {
    const { id, description, amount } = ticketType;

    return (
        <>
            <tr>
                <td>{id}</td>
                <td>{description}</td>
                <td>₡{amount.toLocaleString()}</td>
            </tr>
        </>
    )
}
