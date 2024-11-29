import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import axios from 'axios';
import { API_URL } from '../../../constants/Api';
import { TicketsInfo } from '../../../constants/TicketsInfo';
import { useAuth } from '../../../hooks';
import { TicketsContext } from '../context/TicketsContext';
import { Loader } from '../../../components/Loader';

export const UploadReceiptModal = ({ onClose, id }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar el Loader
    const { user } = useAuth();
    const { refetchTickets } = useContext(TicketsContext);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            setFile(null);
            showErrorAlert("Por favor, seleccione un archivo PDF.");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            showErrorAlert("Por favor, seleccione un archivo PDF");
            return;
        }

        setIsLoading(true); // Mostrar Loader al iniciar el proceso

        try {
            const response = await axios.get(`${API_URL}/TicketDTO`);

            if (response.status === 200) {
                const ticket = response.data.find(ticket => ticket.id === id);

                if (ticket) {
                    const ticketDescription = ticket.description;
                    const ticketAmount = TicketsInfo[ticketDescription];

                    if (!ticketAmount) {
                        showErrorAlert("El ticket no tiene un monto asociado.");
                        setIsLoading(false);
                        return;
                    }

                    const paymentDTO = {
                        id: `${"Pago-" + Date.now()}`,
                        amount: ticketAmount.toString(),
                        tax: "13%",
                        totalAmount: (ticketAmount + ticketAmount * 0.13).toString(),
                        paymentMethod: "Comprobante PDF",
                        userId: user.idNumber,
                        ticketId: id,
                        userEmail: user.email,
                    };

                    const paymentResponse = await axios.post(`${API_URL}/Payment`, paymentDTO);

                    if (paymentResponse.status === 200 || paymentResponse.status === 201) {
                        const statusResponse = await axios.put(`${API_URL}/TicketDTO/${ticket.id}/status`, { status: "Pagada" });

                        if (statusResponse.status === 200 || statusResponse.status === 204) {
                            showSuccessAlert("Pago realizado con éxito");
                            refetchTickets();
                            onClose(); // Cierra el modal
                        } else {
                            throw new Error("Error al actualizar el estado del ticket");
                        }
                    } else {
                        throw new Error("Error al procesar el pago");
                    }
                } else {
                    showErrorAlert("Ticket no encontrado");
                }
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            showErrorAlert("Hubo un problema al procesar el pago. Intenta de nuevo.");
        } finally {
            setIsLoading(false); // Ocultar Loader cuando finalice el proceso
        }
    };

    const handleCloseWithoutApplying = () => {
        onClose(false);
    };

    return (
        <div className="modal-overlay">
            {isLoading ? ( // Mostrar Loader mientras está procesando
                <Loader />
            ) : (
                <div className="modal-content" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <button className="close-button" onClick={handleCloseWithoutApplying}>X</button>
                    <h2>Subir comprobante de pago</h2>


                    <>
                        <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ margin: "0 auto" }} />
                        <button
                            className='apply-btn'
                            onClick={handleUpload}
                            disabled={!file}
                        >
                            Aplicar
                        </button>
                        <button onClick={onClose} className='modal-close-payment' style={{ color: "white" }}>Cancelar</button>
                    </>
                </div>)}
        </div>
    );
};

UploadReceiptModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
};

export default UploadReceiptModal;
