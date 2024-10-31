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

export const AllUserTicketsPage = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false); // Agregar estado para seguimiento de subida

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${API_URL}/TicketDTO`);
                const userTickets = response.data
                    .filter(ticket => ticket.userId === user.userId)
                    .map(ticket => {
                        const amount = TicketsInfo[ticket.description] || 0;
                        return {
                            ...ticket,
                            status: ticket.status || "Pendiente",
                            amount,
                            claimed: ticket.status === "En disputa",
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

    const handleReclamar = async (ticket) => {
        setSelectedTicket(ticket);
        setModalOpen(true);
        setFileUploaded(false); // Reiniciar estado de subida
    };

    const closeModal = (applyChanges) => {
        if (applyChanges && fileUploaded && selectedTicket) {
            // Actualizar el estado del ticket solo si se hizo clic en "Aplicar" y el archivo fue subido
            setTickets(prevTickets =>
                prevTickets.map(t =>
                    t.id === selectedTicket.id ? { ...t, status: "En disputa", claimed: true } : t
                )
            );
        }
        setSelectedTicket(null);
        setModalOpen(false);
    };


    const handleFileUpload = async (file) => {
        if (selectedTicket) {
            try {
                // Cambiar el estado a "En disputa" en la base de datos al subir el archivo
                await axios.put(`${API_URL}/TicketDTO/${selectedTicket.id}/status`, { status: "En disputa" }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                setFileUploaded(true); // Indicar que el archivo se ha subido exitosamente
            } catch (error) {
                console.error("Error updating ticket status:", error);
            }
        }
    };

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
            <h2 className="main__ticket-subtitle">Aquí encuentra las multas hechas a su persona y las acciones que puede tomar en cada una</h2>
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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className='table__children'>
                    {filteredTickets.map((ticket) => (
                        <TicketUser
                            key={ticket.id}
                            id={ticket.id}
                            date={ticket.date}
                            reason={ticket.description}
                            amount={ticket.amount.toLocaleString()}
                            status={ticket.status}
                            isClaimed={ticket.claimed}
                            onReclamar={() => handleReclamar(ticket)}
                        />
                    ))}
                </tbody>
            </table>
            {modalOpen && (
                <ModalTicketPayment
                    onClose={closeModal}
                    ticket={selectedTicket}
                    isClaimed={selectedTicket?.claimed}
                    onFileUpload={handleFileUpload}
                />
            )}
        </div>
    );
};
