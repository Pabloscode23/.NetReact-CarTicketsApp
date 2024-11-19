import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { TicketUser } from '../components/TicketUser';
import '../styles/AllUserTickets.css';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../../hooks';
import { API_URL } from '../../../constants/Api';
import { TicketsInfo } from '../../../constants/TicketsInfo';
import { ModalTicketPayment } from '../../../modules/disputes/components/ModalTicketPayment';
import { TicketsContext } from '../context/TicketsContext';

export const AllUserTicketsPage = () => {
    const { user } = useAuth();
    const { tickets, setTickets, refetchTickets } = useContext(TicketsContext);
    const [userTickets, setUserTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el valor del input de búsqueda
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false); // Estado para el archivo subido

    // Formatea y filtra los tickets según el usuario actual
    const formatUserTicket = (tickets) => {
        const userTickets = tickets
            .filter(ticket => ticket.userId === user.idNumber)
            .map(ticket => {
                return {
                    ...ticket,
                    status: ticket.status || "Pendiente",
                    claimed: ticket.status === "En disputa",
                };
            });
        return userTickets;
    };

    useEffect(() => {
        if (tickets.length > 0) {
            setUserTickets(formatUserTicket(tickets));
        }
    }, [tickets]);



    // Filtrar tickets con base en el searchTerm
    const filteredTickets = userTickets.filter((ticket) =>
        ticket.id.toString().includes(searchTerm) ||
        ticket.date.includes(searchTerm) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.amount !== undefined && ticket.amount.toString().includes(searchTerm)) ||
        (ticket.status && ticket.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleReclamar = (ticket) => {
        setSelectedTicket(ticket);
        setModalOpen(true);
        setFileUploaded(false); // Reiniciar estado de subida
    };

    const closeModal = (applyChanges) => {
        if (applyChanges && fileUploaded && selectedTicket) {
            setTickets(prevTickets =>
                prevTickets.map(t =>
                    t.id === selectedTicket.id ? { ...t, status: "En disputa", claimed: true } : t
                )
            );
        }
        setSelectedTicket(null);
        setModalOpen(false);
    };

    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Multas</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra las multas hechas a su persona y las acciones que puede tomar en cada una</h2>
            <div className="search__container">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search__icon" />
                <input
                    type="text"
                    placeholder="Buscar multa"
                    className="search__ticket"
                    value={searchTerm} // Bind input value to searchTerm
                    onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                />
            </div>
            {filteredTickets.length === 0 ? (
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
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='table__children'>
                        {
                            filteredTickets.map((ticket) => (
                                <TicketUser
                                    key={ticket.id}
                                    id={ticket.id}
                                    date={ticket.date}
                                    reason={ticket.description}
                                    amount={ticket.amount.toLocaleString()}
                                    status={ticket.status}
                                    isClaimed={ticket.claimed}
                                    isPayed={ticket.status === "Pagada"}
                                    onReclamar={() => handleReclamar(ticket)}
                                />
                            ))
                        }
                    </tbody>
                </table>
            )}

            {/* Modal para reclamar la multa */}
            {modalOpen && (
                <ModalTicketPayment
                    onClose={closeModal}
                    ticket={selectedTicket}
                    isClaimed={selectedTicket?.claimed}
                    refetchTickets={refetchTickets}
                    setTickets={setTickets}  // Pasar setTickets al Modal
                />
            )}
        </div>
    );
};
