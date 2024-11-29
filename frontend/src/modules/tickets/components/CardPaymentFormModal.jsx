import React, { useContext, useState } from 'react';
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
import { TicketsContext } from '../context/TicketsContext';
import { Loader } from '../../../components/Loader';

export const CardPaymentFormModal = ({ onClose, id }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [generalError, setGeneralError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Estado del Loader
    const { user } = useAuth();
    const { refetchTickets } = useContext(TicketsContext);

    const onSubmit = async (data) => {
        setGeneralError("");
        setIsLoading(true); // Mostrar el Loader

        try {
            const response = await axios.get(`${API_URL}/TicketDTO`);

            if (response.status === 200) {
                const ticket = response.data.find(ticket => ticket.id === id);

                if (ticket) {
                    const ticketDescription = ticket.description;
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
                            const paymentDTO = {
                                id: `${"Pago-" + Date.now()}`,
                                amount: ticketAmount.toString(),
                                tax: "13%",
                                totalAmount: (ticketAmount + ticketAmount * 0.13).toString(),
                                paymentMethod: "Tarjeta",
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
                                    onClose();
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
        } finally {
            setIsLoading(false); // Ocultar el Loader
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay-paymentModal">
            {isLoading ? ( // Mostrar Loader mientras isLoading es true
                <Loader />
            ) : (
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
                                    const expiryDate = new Date(`20${year}`, month - 1);
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

                </div>)}
        </div>,
        document.body
    );
};

CardPaymentFormModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default CardPaymentFormModal;
