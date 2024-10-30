// Modal.js
import { useState } from 'react';
import '../styles/ModalTicketPayment.css'
import PropTypes from 'prop-types';

export const ModalTicketPayment = ({ onClose, ticket, isClaimed, onFileUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        onFileUpload(file);
    };

    // Nueva función para cerrar el modal sin aplicar cambios
    const handleCloseWithoutApplying = () => {
        onClose(false); // Pasamos un valor falso para indicar que no se debe aplicar el cambio de estado
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
                    disabled={isClaimed} // Deshabilitar si ya está reclamado
                />
                <button className='apply-btn' onClick={() => onClose(true)}>Aplicar</button> {/* Llamada para aplicar el cambio */}
            </div>
        </div>
    );
};

// Definición de PropTypes
ModalTicketPayment.propTypes = {
    onClose: PropTypes.func.isRequired,
    ticket: PropTypes.object.isRequired,
    isClaimed: PropTypes.bool,
    onFileUpload: PropTypes.func.isRequired,
};
