import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import axios from 'axios';
import { API_URL } from '../../../constants/Api';
import { TicketsInfo } from '../../../constants/TicketsInfo'; // Asumiendo que TicketsInfo está definida correctamente
import { useAuth } from '../../../hooks';
import { TicketsContext } from '../context/TicketsContext';

export const UploadReceiptModal = ({ onClose, id }) => {
    const [file, setFile] = useState(null);
    const { user } = useAuth();
    const { refetchTickets } = useContext(TicketsContext);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Validar si el archivo seleccionado es un PDF
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile); // Establecer el archivo si es válido
        } else {
            setFile(null); // Restablecer el archivo si no es válido
            alert("Por favor, seleccione un archivo PDF.");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Por favor, seleccione un archivo PDF");
            return;
        }

        try {
            // Obtener el ticket usando el ID recibido como prop
            const response = await axios.get(`${API_URL}/TicketDTO`);

            if (response.status === 200) {
                // Buscar el ticket que coincida con el id recibido como prop
                const ticket = response.data.find(ticket => ticket.id === id);

                if (ticket) {
                    // Obtener la descripción del ticket
                    const ticketDescription = ticket.description;

                    // Buscar el monto asociado a la descripción del ticket
                    const ticketAmount = TicketsInfo[ticketDescription];

                    if (!ticketAmount) {
                        showErrorAlert("El ticket no tiene un monto asociado.");
                        return;
                    }

                    // Crear el objeto PaymentDTO con los detalles del ticket
                    const paymentDTO = {
                        id: `${"Pago-" + Date.now()}`,  // Generamos un ID único para el pago
                        amount: ticketAmount.toString(),  // Usamos el monto obtenido del objeto TicketsInfo
                        tax: "13%",  // Porcentaje de impuestos
                        totalAmount: (ticketAmount + ticketAmount * 0.13).toString(),  // Total con impuestos
                        paymentMethod: "Comprobante PDF",  // Método de pago (en este caso, PDF)
                        userId: user.idNumber,  // ID del usuario, se obtiene de las props
                        ticketId: id,  // ID del ticket
                        userEmail: user.email,  // Correo electrónico del usuario
                    };

                    // Realizamos la solicitud POST para realizar el pago
                    const paymentResponse = await axios.post(`${API_URL}/Payment`, paymentDTO);

                    if (paymentResponse.status === 200 || paymentResponse.status === 201) {
                        // Luego, actualizamos el estado del ticket a "Pagada"
                        const statusResponse = await axios.put(`${API_URL}/TicketDTO/${ticket.id}/status`, { status: "Pagada" });

                        if (statusResponse.status === 200 || statusResponse.status === 204) {
                            showSuccessAlert("Pago realizado con éxito");
                            refetchTickets(); // Actualizar la lista de tickets
                            onClose(); // Cerrar el modal si el pago es exitoso
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
        }
    };

    const handleCloseWithoutApplying = () => {
        onClose(false); // Cerrar el modal sin aplicar cambios
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <button className="close-button" onClick={handleCloseWithoutApplying}>X</button>
                <h2>Subir comprobante de pago</h2>
                <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ margin: "0 auto" }} />
                <button
                    className='apply-btn'
                    onClick={handleUpload}
                    disabled={!file}  // Deshabilitar si no se ha seleccionado un archivo
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
    user: PropTypes.object.isRequired, // Asegúrate de que 'user' tenga la estructura correcta
};

export default UploadReceiptModal;
