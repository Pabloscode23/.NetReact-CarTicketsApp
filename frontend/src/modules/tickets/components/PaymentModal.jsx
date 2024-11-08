// PaymentModal.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CardPaymentFormModal from './CardPaymentFormModal';
import '../styles/PaymentModal.css';
import { faArrowUpFromBracket, faCreditCard, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export const PaymentModal = ({ onClose, onSelectPayment }) => {
    const [isCardPaymentOpen, setIsCardPaymentOpen] = useState(false);

    const handleCardPaymentSelect = () => {
        setIsCardPaymentOpen(true);
    };

    const handleCloseCardPayment = () => {
        setIsCardPaymentOpen(false);
    };
    const card = <FontAwesomeIcon icon={faCreditCard} />;
    const check = <FontAwesomeIcon icon={faArrowUpFromBracket} />;

    return ReactDOM.createPortal(
        <div className="modal-overlay-payment">
            <div className="modal-content-payment">
                <h2 className="modal-title-payment">Seleccione el Método de Pago</h2>
                <div className="modal-buttons-payment">
                    <button className="modal-button-payment" onClick={handleCardPaymentSelect}>
                        <span className="icon">{card}</span>
                        <span className="text">Tarjeta</span>
                    </button>
                    <button className="modal-button-payment" onClick={() => onSelectPayment('comprobante')}>
                        <span className="icon">{check}</span>
                        <span className="text">Comprobante de SINPE</span>
                    </button>
                    <button className="modal-close-payment" onClick={onClose}>Cancelar</button>
                </div>
            </div>
            {isCardPaymentOpen && <CardPaymentFormModal onClose={handleCloseCardPayment} />}
        </div>,
        document.body
    );

};

PaymentModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSelectPayment: PropTypes.func.isRequired,
};

export default PaymentModal;
