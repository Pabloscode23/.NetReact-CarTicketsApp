import { useContext, useEffect, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../../hooks";
import { UserClaims } from "../components/UserClaims";
import { TicketsContext } from "../../tickets/context/TicketsContext";
import { TicketsInfo } from "../../../constants/TicketsInfo";
import { TicketUser } from "../../tickets/components/TicketUser";
import { ClaimsOfficer } from "../../tickets/components/ClaimsOfficer";

export const OfficerClaimsPage = () => {
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
            // Filtrar tickets con status diferente de "Pendiente"
            const nonPendingTickets = tickets.filter(ticket => ticket.status !== "Pendiente");

            // Formatear los tickets filtrados
            const formattedTickets = formatUserTicket(nonPendingTickets);
            setFilteredTickets(formattedTickets);  // Actualizar con los tickets filtrados y formateados
        } else {
            setFilteredTickets([]);
        }
    }, [tickets]);

    const handleEdit = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleSave = async (updatedTicket) => {
        console.log("Ticket a actualizar:", updatedTicket); // Verifica que id no sea undefined

        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.id === updatedTicket.id ? { ...ticket, date: updatedTicket.date, description: updatedTicket.description } : ticket
            )
        );

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
            <h1 className="main__ticket-title">Reclamos</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra los reclamos hechos a las multas creadas por su persona</h2>
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
                <div className='table__empty'>No hay reclamos disponibles.</div>
            ) : (
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
                        {filteredTickets.map(ticket => (
                            <ClaimsOfficer
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

        </div>
    );
};
