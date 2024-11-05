import { useEffect, useState } from 'react';
import axios from 'axios';
import { TicketUser } from '../components/TicketUser';
import '../styles/AllUserTickets.css';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../../hooks';
import { API_URL } from '../../../constants/Api';
import { TicketsInfo } from '../../../constants/TicketsInfo';
import { ModalTicketPayment } from '../../../modules/disputes/components/ModalTicketPayment';
import { TicketAdmin } from '../components/TicketAdmin';
import { EditTicketModal } from '../../disputes/components/EditTicketModal';
import { AdminEditTicketModal } from '../../disputes/components/AdminEditTicketModal';

export const AdminAllTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null); // Agregar estado para seguimiento de subida
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${API_URL}/TicketDTO`);
                const userTickets = response.data

                    .map(ticket => {
                        const amount = TicketsInfo[ticket.description] || 0;
                        return {
                            ...ticket,
                            amount,
                        };
                    });

                setTickets(userTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setError("Error fetching tickets. Please try again later.");
            }
        };

        if (user?.idNumber) {
            fetchTickets();
        }
    }, [user]);

    const handleEdit = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };
    const handleSave = async (updatedTicket) => {
        // Optimistically update the ticket in the local state
        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.id === updatedTicket.id ? { ...ticket, date: updatedTicket.date, description: updatedTicket.description } : ticket
            )
        );

        // Send the updated ticket to the server
        try {
            alert("Multa actualizada correctamente, refrezca la página para ver los cambios.");
            const response = await axios.put(`${API_URL}/TicketDTO/${updatedTicket.id}`, updatedTicket);
            // If you want to ensure the response matches what you expect, update the ticket with the response data
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.id === response.data.id ? response.data : ticket
                )
            );

        } catch (error) {
            console.error("Error updating ticket:", error);
            // Optionally revert back to original ticket data if there's an error
            // You may want to implement a way to save the original ticket data before optimistic update
        }

        setIsModalOpen(false);
    }
    const handleDelete = async (ticket) => {
        try {
            await axios.delete(`${API_URL}/TicketDTO/${ticket.id}`);
            setTickets((prevTickets) => prevTickets.filter((t) => t.id !== ticket.id));
        } catch (error) {
            console.error("Error deleting ticket:", error);
        }
    }


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
            <h2 className="main__ticket-subtitle">Aquí encuentra todas las multas presentes en el sistema</h2>
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
            {filteredTickets.length === 0 ? (
                <div className='table__empty'>No hay multas disponibles.</div>
            ) : (<table className="ticket-table">
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
                    {
                        filteredTickets.map((ticket) => (
                            <TicketAdmin
                                key={ticket.id}
                                id={ticket.id}
                                date={ticket.date}
                                reason={ticket.description}
                                amount={ticket.amount.toLocaleString()}
                                status={ticket.status}
                                onEdit={() => handleEdit(ticket)}
                                onDelete={() => handleDelete(ticket)}
                            />
                        ))
                    }
                </tbody>

            </table>)}
            <AdminEditTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ticket={selectedTicket}
                onSave={handleSave} // Pass handleSave to the modal
            />
        </div>
    );
};
