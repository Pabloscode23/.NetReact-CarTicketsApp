import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import '../styles/CardPaymentFormModal.css';
import { paymentCards } from '../../../constants/paymentCards';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import axios from 'axios';
import { API_URL } from '../../../constants/Api';
import { useAuth } from '../../../hooks';
import { TicketsInfo } from '../../../constants/TicketsInfo';

export const CardPaymentFormModal = ({ onClose, id }) => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [generalError, setGeneralError] = useState("");
    const { user } = useAuth();
    const onSubmit = async (data) => {
        setGeneralError("");

        // Hacer el GET para obtener los tickets
        try {
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

                    const cardMatch = paymentCards.find(card =>
                        card.number === data.cardNumber &&
                        card.name === data.ownerName &&
                        card.date === data.expiryDate &&
                        card.ccv === data.ccv
                    );

                    if (cardMatch) {
                        try {
                            console.log("Pago realizado con éxito", data);

                            // Crear el objeto PaymentDTO con los detalles del ticket
                            const paymentDTO = {
                                id: `${"Pago-" + Date.now()}`,  // Usamos el ID del ticket obtenido
                                amount: ticketAmount.toString(),  // Se usa el monto obtenido del objeto TicketsInfo
                                tax: "13%",  // Asegúrate de que sea un string
                                totalAmount: (ticketAmount + ticketAmount * 0.13).toString(),  // Calcula el total con impuestos
                                paymentMethod: "Tarjeta",  // Seteado como "Tarjeta"
                                userId: user.idNumber,  // Este valor lo puedes obtener del estado o de un contexto global
                                ticketId: id,  // Usamos el ID del ticket
                                userEmail: user.email,  // Este valor debe provenir del estado o contexto
                            };

                            // Realiza la llamada POST para realizar el pago
                            const paymentResponse = await axios.post(`${API_URL}/Payment`, paymentDTO);

                            console.log("Pago realizado con estado", paymentResponse.status);

                            if (paymentResponse.status === 200 || paymentResponse.status === 201) {
                                // Luego, actualiza el estado del ticket a "Pagada"


                                const statusResponse = await axios.put(`${API_URL}/TicketDTO/${ticket.id}/status`, { status: "Pagada" });

                                if (statusResponse.status === 200 || statusResponse.status === 204) {
                                    showSuccessAlert("Pago realizado con éxito");
                                    onClose(); // Cerrar el modal si el pago es exitoso
                                } else {
                                    throw new Error("Error al actualizar el estado de la multa");
                                }
                            } else {
                                throw new Error("Error al procesar el pago");
                            }
                        } catch (error) {
                            console.error("Error en la solicitud:", error);
                            showErrorAlert("Hubo un problema al procesar el pago. Intenta de nuevo.");
                        }
                    } else {
                        showErrorAlert("Los datos de la tarjeta no son válidos o no coinciden.");
                    }
                } else {
                    showErrorAlert("Ticket no encontrado");
                }
            }
        } catch (error) {
            console.error("Error al obtener los tickets:", error);
            showErrorAlert("Hubo un problema al obtener los detalles del ticket.");
        }
    };


    return ReactDOM.createPortal(
        <div className="modal-overlay-paymentModal">
            <div className="modal-content-paymentModal">
                <h2 className="modal-title-paymentModal">Información necesaria</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="payment-form-paymentModal">
                    <label className="form-label-paymentModal">Número de la tarjeta</label>
                    <input
                        placeholder='1234567890123456'
                        className="form-input-paymentModal"
                        type="text"
                        {...register("cardNumber", {
                            required: "Número de la tarjeta es requerido",
                            pattern: {
                                value: /^[0-9]{16}$/,
                                message: "El número de la tarjeta debe tener 16 dígitos"
                            }
                        })}
                    />
                    {errors.cardNumber && <p className="form__error">{errors.cardNumber.message}</p>}

                    <label className="form-label-paymentModal">Nombre del propietario</label>
                    <input
                        placeholder='Nombre Apellido X'
                        className="form-input-paymentModal"
                        type="text"
                        {...register("ownerName", {
                            required: "Nombre del propietario es requerido",
                            pattern: {
                                value: /^[A-Za-z]+(?:\s[A-Za-z]+)+\s[A-Za-z]$/,
                                message: "El formato debe ser: Nombre Apellido A"
                            }
                        })}
                    />
                    {errors.ownerName && <p className="form__error">{errors.ownerName.message}</p>}

                    <label className="form-label-paymentModal">Fecha de vencimiento</label>
                    <input
                        placeholder='mm/aa'
                        className="form-input-paymentModal"
                        type="text"
                        {...register("expiryDate", {
                            required: "Fecha de vencimiento es requerida",
                            pattern: {
                                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                                message: "El formato debe ser mm/aa"
                            },
                            validate: (value) => {
                                const currentDate = new Date();
                                const [month, year] = value.split('/');
                                const expiryDate = new Date(`20${year}`, month - 1); // MM es 0 basado en JavaScript
                                return expiryDate > currentDate || "La fecha de vencimiento debe ser futura";
                            }
                        })}
                    />
                    {errors.expiryDate && <p className="form__error">{errors.expiryDate.message}</p>}

                    <label className="form-label-paymentModal">Código CCV</label>
                    <input
                        placeholder='xxx'
                        className="form-input-paymentModal"
                        type="password"
                        {...register("ccv", {
                            required: "Código CCV es requerido",
                            pattern: {
                                value: /^[0-9]{3}$/,
                                message: "El código CCV debe tener 3 dígitos numéricos"
                            }
                        })}
                    />
                    {errors.ccv && <p className="form__error">{errors.ccv.message}</p>}

                    <div className="modal-buttons-paymentModal">
                        <button type="submit" className="modal-button-submit-paymentModal">Enviar</button>
                        <button type="button" onClick={onClose} className="modal-button-close-paymentModal">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

CardPaymentFormModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default CardPaymentFormModal;
