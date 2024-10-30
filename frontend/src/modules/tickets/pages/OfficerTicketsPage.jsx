import { useEffect, useState } from 'react';
import axios from 'axios';
import { TicketOfficer } from '../components/TicketOfficer';
import '../styles/AllUserTickets.css';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../../hooks';
import { API_URL } from '../../../constants/Api';
import { TicketsInfo } from '../../../constants/TicketsInfo';


export const OfficerTicketsPage = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${API_URL}/TicketDTO`);
                console.log("Logged in user ID:", user.userId);
                console.log("Fetched tickets:", response.data);

                // Filter tickets by the logged-in user's ID
                const userTickets = response.data
                    .filter(ticket => ticket.officerId === user.userId)
                    .map(ticket => {
                        console.log("Ticket Description:", ticket.description);

                        const amount = TicketsInfo[ticket.description] || 0;

                        return {
                            ...ticket,
                            status: ticket.status || "Pendiente",
                            amount,
                            claimed: ticket.status === "Reclamada" // Add a claimed property based on status
                        };
                    });

                setTickets(userTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setError("Error fetching tickets. Please try again later.");
            }
        };

        if (user?.userId) {
            fetchTickets();
        }
    }, [user]);

    const handleDispute = async (id) => {
        try {
            await axios.put(`${API_URL}/TicketDTO/${id}/status`, { status: "En disputa" }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Update local state to reflect the change
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.id === id ? { ...ticket, status: "En disputa", claimed: true } : ticket // Mark as claimed
                )
            );
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    };

    // Filter tickets based on searchTerm
    const filteredTickets = tickets.filter((ticket) =>
        ticket.id.toString().includes(searchTerm) ||
        ticket.date.includes(searchTerm) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.amount !== undefined && ticket.amount.toString().includes(searchTerm)) ||
        (ticket.status && ticket.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Multas</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra las multas hechas por su persona</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="search__container">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search__icon" />
                <input
                    type="text"
                    placeholder="Buscar multa"
                    className="search__ticket"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className="ticket-table">
                <thead>
                    <tr className='table__head'>
                        <th>ID multa</th>
                        <th>Fecha</th>
                        <th>Razón de la multa</th>
                        <th>Monto de la multa</th>
                        <th>Estado</th>

                    </tr>
                </thead>
                <tbody className='table__children'>
                    {filteredTickets.map((ticket) => (
                        <TicketOfficer
                            key={ticket.id}
                            id={ticket.id}
                            date={ticket.date}
                            reason={ticket.description}
                            amount={(ticket.amount ? ticket.amount.toLocaleString() : '0')}
                            status={ticket.status}
                            onDispute={() => handleDispute(ticket.id)}
                            isClaimed={ticket.claimed} // Pass claimed status to TicketUser
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
