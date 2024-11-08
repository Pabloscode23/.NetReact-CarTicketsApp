import React from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import '../styles/CardPaymentFormModal.css';

export const CardPaymentFormModal = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Form data:", data);
        onClose(); // Close modal after submission
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
                                const expiryDate = new Date(`20${year}`, month - 1); // MM is 0-based in JavaScript
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
};

export default CardPaymentFormModal;
