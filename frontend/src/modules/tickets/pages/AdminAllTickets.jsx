import { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';

import '../styles/AllUserTickets.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../../hooks';
import { API_URL } from '../../../constants/Api';


import { TicketAdmin } from '../components/TicketAdmin';

import { TicketsContext } from '../context/TicketsContext';
import { showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { EditTicketModal } from '../../disputes/components/EditTicketModal';

export const AdminAllTickets = () => {
    const { user } = useAuth();
    const { tickets, setTickets, refetchTickets } = useContext(TicketsContext);
    const [userTickets, setUserTickets] = useState([]);

    const [filteredTickets, setFilteredTickets] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const searchInputRef = useRef(null);

    // Función para formatear los tickets
    const formatUserTicket = (tickets) => {
        console.log("Tickets originales:", tickets);
        return tickets.map(ticket => {
            return { ...ticket };
        });
    };

    useEffect(() => {
        if (tickets.length > 0) {
            setUserTickets(formatUserTicket(tickets));
        } else {
            console.log("No hay tickets");

        }
    }, [tickets]);

    // Función para filtrar tickets
    const filterTickets = (searchTerm) => {
        return tickets.filter(ticket =>
            ticket.id.toString().includes(searchTerm) ||
            (ticket.date && ticket.date.includes(searchTerm)) ||
            (ticket.description && ticket.description.toLowerCase().includes(searchTerm)) ||
            (ticket.amount !== undefined && ticket.amount.toString().includes(searchTerm)) ||
            (ticket.status && ticket.status.toLowerCase().includes(searchTerm))
        );
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();
        if (searchTerm) {
            const filtered = filterTickets(searchTerm);
            console.log("Resultados del filtro:", filtered);
            setFilteredTickets(filtered);
            setIsFiltered(true);
        } else {
            resetFilter();
        }
    };


    // Efecto para inicializar `filteredTickets` con los datos formateados
    useEffect(() => {
        if (tickets.length > 0) {
            const formattedTickets = formatUserTicket(tickets);
            setFilteredTickets(formattedTickets); // Establece los tickets formateados
        } else {
            setFilteredTickets([]);
        }
    }, [tickets]);


    // Manejar el filtro


    // Reiniciar el filtro
    const resetFilter = () => {
        const formattedTickets = formatUserTicket(tickets);
        setFilteredTickets(formattedTickets);
        setIsFiltered(false);
        if (searchInputRef.current) {
            searchInputRef.current.value = ""; // Limpiar el input de búsqueda
        }
    };

    // Editar ticket
    const handleEdit = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    // Guardar cambios en un ticket
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

    // Eliminar ticket
    const handleDelete = async (ticket) => {
        try {
            console.log("Intentando eliminar el claim asociado al ticket:", ticket.id);

            // Obtener el claim asociado al ticket
            const response = await axios.get(`${API_URL}/Claim`);
            const claims = response.data;
            const claim = claims.find(c => c.ticketId === ticket.id); // Buscar manualmente si no hay filtro en la API

            if (claim && claim.claimId) {
                // Eliminar el claim asociado
                await axios.delete(`${API_URL}/Claim/${claim.claimId}`);
                console.log(`Claim asociado al ticket ${ticket.id} eliminado correctamente.`);
            } else {
                console.log(`No se encontró ningún claim asociado al ticket ${ticket.id}.`);
            }

            // Eliminar el ticket
            await axios.delete(`${API_URL}/TicketDTO/${ticket.id}`);
            console.log(`Ticket ${ticket.id} eliminado correctamente.`);

            // Mostrar alerta de éxito
            showSuccessAlert("Multa eliminada correctamente");

            // Actualizar estado para reflejar los cambios en la UI
            setTickets(prevTickets => prevTickets.filter(t => t.id !== ticket.id));
            setFilteredTickets(prevTickets => prevTickets.filter(t => t.id !== ticket.id));
        } catch (error) {
            console.error("Error eliminando el ticket o el claim asociado:", error);
        }
    };


    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Historial de multas</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra todas las multas presentes en el sistema</h2>
            {error && <p className="error-message">{error}</p>}
            <div style={{ marginBottom: "25px", width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ marginLeft: "9.5vw", alignSelf: "flex-start", width: "50%", display: 'flex', flexDirection: "column", gap: "10px" }}>
                    <label style={{ textAlign: "left", color: "#2E8EB1" }}>Buscar por ID, fecha, descripción, monto o estado</label>
                    <form onSubmit={handleFilter} style={{ display: 'flex', width: '80%', justifyContent: 'center' }}>
                        <input
                            ref={searchInputRef}
                            className="default__input"
                            type="text"
                            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                            placeholder="Ingrese término de búsqueda"
                        />
                        {isFiltered && (
                            <button onClick={resetFilter} className='default__button' style={{ borderRadius: "0px", width: "10%" }}>
                                <FontAwesomeIcon icon={faRotateRight} />
                            </button>
                        )}
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
                                    amount={ticket.amount?.toLocaleString()}
                                    status={ticket.status}
                                    onEdit={() => handleEdit(ticket)}
                                    onDelete={() => handleDelete(ticket)}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
                <EditTicketModal
                    isOpen={isModalOpen}
                    id={tickets.id}
                    onClose={() => setIsModalOpen(false)}
                    ticket={selectedTicket}
                    onSave={handleSave}
                    refetchTickets={refetchTickets}
                />
            </div>
        </div>
    );
};





