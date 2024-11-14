import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import axios from 'axios';
import { API_URL } from '../../../constants/Api';

export const UploadReceiptModal = ({ onClose, id }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Check if the selected file is a PDF
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile); // Set file if valid PDF
        } else {
            setFile(null); // Reset file if invalid
            alert("Por favor, seleccione un archivo PDF.");
        }
    };

    const handleUpload = () => {
        if (!file) {
            alert("Por favor, seleccione un archivo PDF");
            return;
        }

        const formData = new FormData();
        formData.append('receipt', file);

        // Aquí puedes enviar `formData` a tu backend con una solicitud POST
        fetch('/api/upload-receipt', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log("Archivo subido con éxito:", data);
                onClose(); // Close the modal after successful upload
            })
            .catch(error => {
                console.error("Error al subir el archivo:", error);
            });
    };

    const onSubmit = async (data) => {
        handleUpload();

        try {
            const response = await axios.put(`${API_URL}/TicketDTO/${id}/status`, { status: "Pagada" });
            if (response.status === 200 || response.status === 204) {
                showSuccessAlert("Pago realizado con éxito");
                onClose(); // Cerrar el modal si el pago es exitoso
            } else {
                throw new Error("Error al actualizar el estado de la multa");
            }

        } catch (error) {
            console.error("Error en la solicitud PUT:", error);
            showErrorAlert("Hubo un problema al procesar el pago. Intenta de nuevo.");
        }
    };

    const handleCloseWithoutApplying = () => {
        onClose(false); // Close modal without applying changes
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                {/* Botón "X" para cerrar sin aplicar */}
                <button className="close-button" onClick={handleCloseWithoutApplying}>X</button>

                <h2>Subir comprobante de pago</h2>
                <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ margin: "0 auto" }} />

                {/* Disable the button if no file or if the file is not a PDF */}
                <button
                    className='apply-btn'
                    onClick={onSubmit}
                    disabled={!file}  // Disable if no file is selected
                >
                    Aplicar
                </button>

                <button onClick={onClose} className='modal-close-payment' style={{ color: "white" }}>Cancelar</button>
            </div>
        </div>
    );
};

UploadReceiptModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default UploadReceiptModal;
