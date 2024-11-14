import React, { useState } from 'react';
import '../styles/ModalTicketPayment.css';
import PropTypes from 'prop-types';
import { showErrorAlert } from '../../../constants/Swal/SwalFunctions';

export const ModalTicketPayment = ({ onClose, ticket, isClaimed, onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            showErrorAlert('Por favor, selecciona un archivo PDF.');
            return;
        }
        setSelectedFile(file);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            showErrorAlert('Por favor, selecciona un archivo antes de aplicar.');
            return;
        }

        const data = new FormData();
        data.append('file', selectedFile);
        data.append('upload_preset', 'MyCloudinary');
        data.append('cloud_name', 'dgiuo69gy');
        data.append('public_id', `ticket_pdf/${selectedFile.name}`);

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dgiuo69gy/raw/upload', {
                method: 'POST',
                body: data,
                headers: {},
                mode: 'cors',
            });

            const result = await response.json();

            if (response.ok) {
                // Verifica que la respuesta contiene el URL seguro
                console.log("Archivo subido con éxito:", result);

                // Acceder a la URL segura (PDF)
                const pdfUrl = result.secure_url;

                // Almacenar la URL del PDF para mostrarla más tarde
                setPdfUrl(pdfUrl);
                onFileUpload(pdfUrl); // Pasar la URL al callback para que se maneje en el componente padre
                onClose(true);
            } else {
                showErrorAlert('Error al subir el archivo.');
                console.error('Error:', result);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            showErrorAlert('Ocurrió un error inesperado.');
        }
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

                <div>
                    {pdfUrl && <p>Vista previa del archivo: <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Ver el PDF</a></p>}
                </div>

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

ModalTicketPayment.propTypes = {
    onClose: PropTypes.func.isRequired,
    ticket: PropTypes.object.isRequired,
    isClaimed: PropTypes.bool,
    onFileUpload: PropTypes.func.isRequired,
};
