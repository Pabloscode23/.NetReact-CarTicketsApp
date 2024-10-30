import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { TicketUser } from '../components/TicketUser';
import '../styles/AllUserTickets.css';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../../hooks';
import { API_URL } from '../../../constants/Api';
import { TicketsInfo } from '../../../constants/TicketsInfo'; // Import TicketsInfo

export const AllUserTicketsPage = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${API_URL}/TicketDTO`);
                console.log("Logged in user ID:", user.UserId);
                console.log("Fetched tickets:", response.data);

                // Filter tickets by the logged-in user's ID and set default status
                const userTickets = response.data
                    .filter(ticket => ticket.userId == user.UserId) // Filter tickets by user ID
                    .map(ticket => {
                        // Debugging log for ticket description
                        console.log("Ticket Description:", ticket.description);

                        const amount = TicketsInfo[ticket.description] || 0; // Use description to find the amount

                        return {
                            ...ticket,
                            status: ticket.status || "Pendiente", // Set status to "Pendiente" if it is not set
                            amount // Assign the amount from TicketsInfo
                        };
                    });

                setTickets(userTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setError("Error fetching tickets. Please try again later."); // Set error message
            }
        };

        if (user?.UserId) { // Check for the correct property name here
            fetchTickets();
        }
    }, [user]);

    const handleDispute = async (id) => {
        try {
            // Llama a la API para actualizar la descripción del ticket
            await axios.put(`${API_URL}/TicketDTO/${id}/status`, "Reclamada");

            // Actualiza el estado local para reflejar el cambio
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.id === id ? { ...ticket, status: "Reclamada" } : ticket
                )
            );
        } catch (error) {
            console.error("Error updating ticket status:", error);
            // Manejo de errores (puedes agregar un estado para mostrar mensajes de error al usuario)
        }
    };


    // Filter tickets based on searchTerm
    const filteredTickets = tickets.filter((ticket) =>
        ticket.id.toString().includes(searchTerm) ||
        ticket.date.includes(searchTerm) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) || // Check for description
        (ticket.amount && ticket.amount.toString().includes(searchTerm)) || // Check for amount
        (ticket.status && ticket.status.toLowerCase().includes(searchTerm.toLowerCase())) // Check for status
    );

    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Multas</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra las multas hechas a su persona y las acciones que puede tomar en cada una</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className='table__children'>
                    {filteredTickets.map((ticket) => (
                        <TicketUser
                            key={ticket.id}
                            id={ticket.id}
                            date={ticket.date}
                            reason={ticket.description} // Keep the original description from the database
                            amount={(ticket.amount ? ticket.amount.toLocaleString() : '0')} // Format amount for display
                            status={ticket.status}
                            onDispute={() => handleDispute(ticket.id)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
