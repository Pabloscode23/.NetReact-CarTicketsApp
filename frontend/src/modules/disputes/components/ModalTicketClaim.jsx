
import React, { useState } from 'react';
import '../styles/ModalTicketClaim.css';
import PropTypes from 'prop-types';
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import { API_URL } from '../../../constants/Api';

export const ModalTicketClaim = ({ onClose, ticket, isClaimed, refetchTickets, setTickets }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUploaded, setFileUploaded] = useState(false); // Estado para verificar si el archivo se subió exitosamente

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            showErrorAlert('Por favor, selecciona un archivo PDF.');
            return;
        }
        setSelectedFile(file);
    };

    const createClaim = async () => {
        if (!selectedFile) {
            showErrorAlert('Debe seleccionar un archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('claimDocument', selectedFile);
        formData.append('ticketId', ticket.id);
        formData.append('status', 'Pendiente');

        try {
            const res = await axios.post(`${API_URL}/Claim`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === 201) {
                updateTicketState();
                showSuccessAlert('Reclamo creado exitosamente');
                onClose(true);
            }
        } catch (error) {
            console.error('Error al crear el reclamo:', error);
            showErrorAlert('Error al crear el reclamo');
        }
    };

    const updateTicketState = async () => {
        try {
            // Realizar la actualización del ticket en el backend
            await axios.put(`${API_URL}/TicketDTO/${ticket.id}/status`, { status: "En disputa" }, {
                headers: { 'Content-Type': 'application/json' }
            });

            // Actualizar el estado local en AllUserTicketsPage
            setTickets(prevTickets =>
                prevTickets.map(t =>
                    t.id === ticket.id ? { ...t, status: "En disputa", claimed: true } : t
                )
            );

            refetchTickets();  // Refrescar los tickets desde el backend
            setFileUploaded(true);  // Indicar que el archivo se subió exitosamente
        } catch (error) {
            console.error("Error actualizando el ticket:", error);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            showErrorAlert('Por favor, selecciona un archivo antes de aplicar.');
            return;
        }

        createClaim();

    };

    const handleCloseWithoutApplying = () => {
        onClose(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={handleCloseWithoutApplying}>X</button>
                <h2>Reclamar multa</h2>
                <p>ID: {ticket.id}</p>
                <p>Razón de la multa: {ticket.description}</p>
                <p>Monto: {ticket.amount}</p>

                <input
                    type="file"
                    onChange={handleFileChange}
                    disabled={isClaimed}
                />

                <button
                    className="apply-btn"
                    onClick={handleFileUpload}
                    disabled={isClaimed}
                >
                    Aplicar
                </button>
            </div>
        </div>
    );
};

ModalTicketClaim.propTypes = {
    onClose: PropTypes.func.isRequired,
    ticket: PropTypes.object.isRequired,
    isClaimed: PropTypes.bool,
    refetchTickets: PropTypes.func.isRequired,
    setTickets: PropTypes.func.isRequired,
};
