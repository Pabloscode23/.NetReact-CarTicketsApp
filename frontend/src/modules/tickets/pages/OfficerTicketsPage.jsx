import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { TicketOfficer } from '../components/TicketOfficer';
import { EditTicketModal } from '../../../modules/disputes/components/EditTicketModal';
import '../styles/AllUserTickets.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../../constants/Api';
import { TicketsInfo } from '../../../constants/TicketsInfo';
import { showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import { TicketsContext } from '../context/TicketsContext';

export const OfficerTicketsPage = () => {
    const { tickets, setTickets, refetchTickets } = useContext(TicketsContext);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Esta función asegura que se mantenga el valor original de amount
    const formatUserTicket = (tickets) => {
        return tickets.map(ticket => {
            // Obtener amount de TicketsInfo si está disponible, o usar el valor original
            const amount = TicketsInfo[ticket.description] || 0;
            return { ...ticket, amount };  // Mantener el valor original de 'amount'
        });
    };

    useEffect(() => {
        if (tickets.length > 0) {
            const formattedTickets = formatUserTicket(tickets);
            setFilteredTickets(formattedTickets);  // Se mantiene el amount tal cual es
        } else {
            setFilteredTickets([]);
        }
    }, [tickets]);

    const handleEdit = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleSave = async (updatedTicket) => {
        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.id === updatedTicket.id ? { ...ticket, date: updatedTicket.date, description: updatedTicket.description } : ticket
            )
        );

        try {
            showSuccessAlert("Multa actualizada correctamente.");
            const response = await axios.put(`${API_URL}/TicketDTO/${updatedTicket.id}`, updatedTicket);
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.id === response.data.id ? response.data : ticket
                )
            );
        } catch (error) {
            console.error("Error updating ticket:", error);
        }

        setIsModalOpen(false);
    };

    // Filtrar tickets sin afectar el valor original de 'amount'
    const filterTickets = (searchTerm) => {
        return tickets.filter((ticket) => {
            const ticketId = ticket.id ? ticket.id.toString() : "";
            const ticketDate = ticket.date || "";
            const ticketReason = ticket.description ? ticket.description.toLowerCase() : "";
            const ticketAmount = ticket.amount ? ticket.amount.toString() : ""; // Aseguramos que 'amount' sea una cadena
            const ticketStatus = ticket.status ? ticket.status.toLowerCase() : "";

            // Comprobamos si el término de búsqueda está presente en cualquier campo relevante
            return (
                ticketId.includes(searchTerm) ||
                ticketDate.includes(searchTerm) ||
                ticketReason.includes(searchTerm.toLowerCase()) ||
                ticketAmount.includes(searchTerm) || // Compara 'amount' como texto
                ticketStatus.includes(searchTerm.toLowerCase())
            );
        });
    };


    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        setSearchTerm(searchTerm);

        // Filtrar los tickets al cambiar el término de búsqueda
        if (searchTerm) {
            const filtered = filterTickets(searchTerm);
            setFilteredTickets(filtered);
        } else {
            // Restablecer la lista de tickets cuando el campo de búsqueda está vacío
            setFilteredTickets(tickets);
        }
    };

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
                    onChange={handleSearchChange} // Actualizar el término de búsqueda
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
                                amount={ticket.amount}
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
                onSave={handleSave}
                refetchTickets={refetchTickets}
            />
        </div>
    );
};
