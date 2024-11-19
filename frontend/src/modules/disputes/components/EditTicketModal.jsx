import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TicketsInfo } from "../../../constants/TicketsInfo";
import axios from "axios";
import { API_URL } from "../../../constants/Api";
import { showSuccessAlert } from "../../../constants/Swal/SwalFunctions";

export const EditTicketModal = ({ isOpen, onClose, ticket, onSave, refetchTickets }) => {
    const [editableTicket, setEditableTicket] = useState({});

    useEffect(() => {
        if (ticket) {
            setEditableTicket({ ...ticket });
        }
    }, [ticket]);

    if (!isOpen || !ticket) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "reason") {
            // Actualizar automáticamente el amount según la razón seleccionada
            const newAmount = TicketsInfo[value] || 0;  // Asignar 0 si no existe el reason
            setEditableTicket((prev) => ({
                ...prev,
                [name]: value,
                amount: newAmount,  // Actualizamos el amount
            }));
        } else {
            setEditableTicket((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`${API_URL}/TicketDTO/${editableTicket.id}`, {
                description: editableTicket.reason,  // Razón de la multa
                date: editableTicket.date,
                amount: editableTicket.amount,  // Enviamos el amount calculado
            });

            // Llamar a onSave con los datos actualizados
            onSave(response.data);
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
                <input className="label-date"
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
                    {Object.entries(TicketsInfo).map(([description], index) => (
                        <option key={index} value={description}>{description}</option>
                    ))}
                </select>

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
};
