import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { TicketUser } from '../components/TicketUser';
import '../styles/AllUserTickets.css';
import { faMagnifyingGlass, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../../hooks';
import { API_URL } from '../../../constants/Api';
import { TicketsInfo } from '../../../constants/TicketsInfo';
import { ModalTicketPayment } from '../../../modules/disputes/components/ModalTicketPayment';
import { TicketAdmin } from '../components/TicketAdmin';
import { AdminEditTicketModal } from '../../disputes/components/AdminEditTicketModal';

export const AdminAllTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const searchInputRef = useRef(null); // referencia al input de búsqueda
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${API_URL}/TicketDTO`);
                const userTickets = response.data.map(ticket => {
                    const amount = TicketsInfo[ticket.description] || 0;
                    return { ...ticket, amount };
                });
                setTickets(userTickets);
                setFilteredTickets(userTickets); // mostrar todos los tickets inicialmente
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setError("Error fetching tickets. Please try again later.");
            }
        };

        if (user?.idNumber) {
            fetchTickets();
        }
    }, [user]);

    const handleFilter = (e) => {
        e.preventDefault();
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();
        if (searchTerm) {
            setFilteredTickets(filterTickets(searchTerm));
            setIsFiltered(true);
        } else {
            resetFilter();
        }
    };

    const filterTickets = (searchTerm) => {
        return tickets.filter(ticket =>
            ticket.id.toString().includes(searchTerm) ||
            (ticket.date && ticket.date.includes(searchTerm)) ||
            (ticket.description && ticket.description.toLowerCase().includes(searchTerm)) ||
            (ticket.amount !== undefined && ticket.amount.toString().includes(searchTerm)) ||
            (ticket.status && ticket.status.toLowerCase().includes(searchTerm))
        );
    };

    const resetFilter = () => {
        setFilteredTickets(tickets);
        setIsFiltered(false);
        if (searchInputRef.current) {
            searchInputRef.current.value = ""; // limpiar el input de búsqueda
        }
    };

    const handleEdit = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleSave = async (updatedTicket) => {
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === updatedTicket.id ? { ...ticket, ...updatedTicket } : ticket
            )
        );
        setFilteredTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === updatedTicket.id ? { ...ticket, ...updatedTicket } : ticket
            )
        );
        setIsModalOpen(false);
    };

    const handleDelete = async (ticket) => {
        try {
            await axios.delete(`${API_URL}/TicketDTO/${ticket.id}`);
            setTickets(prevTickets => prevTickets.filter(t => t.id !== ticket.id));
            setFilteredTickets(prevTickets => prevTickets.filter(t => t.id !== ticket.id));
        } catch (error) {
            console.error("Error deleting ticket:", error);
        }
    };

    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Catálogo de multas</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra todas las multas presentes en el sistema</h2>
            {error && <p className="error-message">{error}</p>}
            <div style={{ marginBottom: "25px", width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ marginLeft: "9.5vw", alignSelf: "flex-start", width: "50%", display: 'flex', flexDirection: "column", gap: "10px" }}>

                    <label style={{ textAlign: "left", color: "#2E8EB1" }}>Buscar por cédula, nombre, apellidos, correo electrónico o rol</label>
                    <form onSubmit={handleFilter} style={{ display: 'flex', width: '80%', justifyContent: 'center' }}>
                        <input
                            ref={searchInputRef} // asignar referencia al input
                            className="default__input"
                            type="text"
                            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, }}
                            placeholder="Ingrese término de búsqueda"
                        />
                        {
                            isFiltered && <button onClick={resetFilter} className='default__button' style={{ borderRadius: "0px", width: "10%" }}><FontAwesomeIcon icon={faRotateRight} /></button>
                        }

                        <button type='submit' className='default__button' style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0, width: "20%" }}>Buscar</button>

                    </form>


                </div>
                {filteredTickets.length === 0 ? (
                    <div className="table__empty">No hay multas disponibles.</div>
                ) : (
                    <table className="ticket-table">
                        <thead>
                            <tr className="table__head">
                                <th>ID multa</th>
                                <th>Fecha</th>
                                <th>Razón de la multa</th>
                                <th>Monto de la multa</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="table__children">
                            {filteredTickets.map(ticket => (
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
                            ))}
                        </tbody>
                    </table>
                )}
                <AdminEditTicketModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    ticket={selectedTicket}
                    onSave={handleSave}
                />
            </div>
        </div >
    );
};
