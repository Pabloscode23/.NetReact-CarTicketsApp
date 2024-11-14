import { useEffect, useState } from 'react';
import axios from 'axios';
import { TicketOfficer } from '../components/TicketOfficer';
import { EditTicketModal } from '../../../modules/disputes/components/EditTicketModal';
import '../styles/AllUserTickets.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../hooks';
import { API_URL } from '../../../constants/Api';
import { TicketsInfo } from '../../../constants/TicketsInfo';
import { showSuccessAlert } from '../../../constants/Swal/SwalFunctions';

export const OfficerTicketsPage = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {

        const fetchTickets = async () => {

            try {
                const response = await axios.get(`${API_URL}/TicketDTO`);


                const userTickets = response.data
                    .filter(ticket => ticket.officerId === user.idNumber)
                    .map(ticket => ({
                        ...ticket,
                        status: ticket.status || "Pendiente",
                        amount: TicketsInfo[ticket.description] || 0,
                    }));
                setTickets(userTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
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
            showSuccessAlert("Multa actualizada correctamente, refrezca la página para ver los cambios.");


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
    };



    const filteredTickets = tickets.filter(ticket =>
        ticket.id.toString().includes(searchTerm) ||
        ticket.date.includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.amount.toString().includes(searchTerm) ||
        ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Multas</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra las multas hechas por su persona</h2>
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
            {(filteredTickets.length === 0) ? (
                <div className='table__empty'>No hay multas disponibles.</div>
            ) : (
                <table className="ticket-table">
                    <thead>
                        <tr className='table__head'>
                            <th>ID multa</th>
                            <th>Fecha</th>
                            <th>Razón de la multa</th>
                            <th>Monto de la multa</th>
                            <th>Estado</th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody className='table__children'>
                        {filteredTickets.map(ticket => (
                            <TicketOfficer
                                key={ticket.id}
                                id={ticket.id}
                                date={ticket.date}
                                reason={ticket.description}
                                amount={ticket.amount.toLocaleString()}
                                status={ticket.status}
                                onEdit={() => handleEdit(ticket)}
                            />
                        ))}
                    </tbody>
                </table>
            )}
            <EditTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ticket={selectedTicket}
                onSave={handleSave} // Pass handleSave to the modal
            />
        </div>
    );
};
