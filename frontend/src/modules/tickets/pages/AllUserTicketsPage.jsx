import { useState } from 'react';
import { TicketUser } from '../components/TicketUser';
import '../styles/AllUserTickets.css';

export const AllUserTicketsPage = () => {
    {/**Hacer un context y llamarlo aqui */ }
    const [tickets, setTickets] = useState([
        {
            id: 1,
            date: "01/10/2024",
            reason: "Exceso de velocidad",
            amount: "13434",
            status: "Pendiente",
        }, {
            id: 2,
            date: "01/10/2024",
            reason: "Parqueo mal",
            amount: "12340",
            status: "Pendiente",
        }, {
            id: 3,
            date: "01/10/2024",
            reason: "Ebriedad",
            amount: "660",
            status: "Pendiente",
        }, {
            id: 4,
            date: "01/10/2024",
            reason: "Exceso de velocidad",
            amount: "650",
            status: "Pendiente",
        }, {
            id: 5,
            date: "01/10/2024",
            reason: "Exceso de velocidad",
            amount: "6500",
            status: "Pendiente",
        }
    ]);
    //Debe de generarse un update en la base de datos
    const handleDispute = (id) => {
        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.id === id ? { ...ticket, status: "Reclamada" } : ticket
            )
        );
    };


    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Multas</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra las multas hechas a su persona y las acciones que puede tomar en cada una</h2>

            <table className="ticket-table">
                <thead>
                    <tr className='table__head'>
                        <th>ID multa</th>
                        <th>Fecha</th>
                        <th>Razón de la multa</th>
                        <th>Monto de la multa</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className='table__children'>
                    {tickets.map((ticket) => (
                        <TicketUser key={ticket.id}
                            id={ticket.id}
                            date={ticket.date}
                            reason={ticket.reason}
                            amount={ticket.amount}
                            status={ticket.status}
                            onDispute={() => handleDispute(ticket.id)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
