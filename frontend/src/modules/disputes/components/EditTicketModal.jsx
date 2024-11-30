import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { API_URL } from "../../../constants/Api";
import { showSuccessAlert } from "../../../constants/Swal/SwalFunctions";

export const EditTicketModal = ({ isOpen, onClose, ticket, onSave, refetchTickets }) => {
    const [editableTicket, setEditableTicket] = useState({});
    const [reasons, setReasons] = useState([]); // Almacena las razones disponibles

    useEffect(() => {
        // Cargar razones de multas desde la base de datos
        const fetchReasons = async () => {
            try {
                const response = await axios.get(`${API_URL}/TicketType`); // Ruta para obtener las razones
                setReasons(response.data); // Suponemos que el endpoint devuelve un array de objetos
            } catch (error) {
                console.error("Error fetching reasons:", error);
            }
        };

        fetchReasons();
    }, []);

    useEffect(() => {
        if (ticket) {
            setEditableTicket({ ...ticket });
        }
    }, [ticket]);

    if (!isOpen || !ticket) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "reason") {
            // Buscar el monto correspondiente a la razón seleccionada
            const selectedReason = reasons.find((reason) => reason.description === value);
            const newAmount = selectedReason?.amount || 0; // Asignar 0 si no se encuentra la razón
            setEditableTicket((prev) => ({
                ...prev,
                [name]: value,
                amount: newAmount, // Actualizar el amount
            }));
        } else {
            setEditableTicket((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            // Construir el objeto para enviar al backend
            const ticketUpdate = {
                description: editableTicket.reason, // Razón de la multa
                amount: editableTicket.amount,     // Monto de la multa
            };

            // Realizar la solicitud PUT al backend
            await axios.put(`${API_URL}/TicketDTO/${editableTicket.id}`, ticketUpdate);

            // Notificar al usuario y actualizar la interfaz
            showSuccessAlert("Multa actualizada correctamente");
            refetchTickets();
            onClose();
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };


    const isEditable = editableTicket.status === "Pendiente";

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Multa</h2>

                <label>ID multa:</label>
                <input className="label-id" type="text" value={editableTicket.id || ''} readOnly />

                <label>Fecha:</label>
                <input
                    className="label-date"
                    type="datetime-local"
                    name="date"
                    value={editableTicket.date?.substring(0, 16) || ''}
                    onChange={handleChange}
                    disabled={!isEditable}
                />

                <label>Razón de la multa:</label>
                <select
                    name="reason"
                    value={editableTicket.reason || ''}
                    onChange={handleChange}
                    disabled={!isEditable}
                >
                    <option value="">Seleccione...</option>
                    {reasons.map((reason) => (
                        <option key={reason.id} value={reason.description}>
                            {reason.description}
                        </option>
                    ))}
                </select>

                <label>Monto:</label>
                <input
                    type="text"
                    value={editableTicket.amount}
                    readOnly
                />

                <div className="modal-buttons">
                    <button className="form__button" onClick={handleSave} disabled={!isEditable}>Guardar</button>
                    <button className="form__button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

EditTicketModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    ticket: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    refetchTickets: PropTypes.func.isRequired,
};
