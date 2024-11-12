import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CardPaymentFormModal from './CardPaymentFormModal';
import UploadReceiptModal from '../components/UploadReceiptModal';
import '../styles/PaymentModal.css';
import { faArrowUpFromBracket, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const PaymentModal = ({ onClose, onSelectPayment, id }) => {
    const [isCardPaymentOpen, setIsCardPaymentOpen] = useState(false);
    const [isUploadReceiptOpen, setIsUploadReceiptOpen] = useState(false);

    const handleCardPaymentSelect = () => {
        setIsCardPaymentOpen(true);
    };

    const handleReceiptUploadSelect = () => {
        setIsUploadReceiptOpen(true);
    };

    const handleCloseCardPayment = () => {
        setIsCardPaymentOpen(false);
    };

    const handleCloseUploadReceipt = () => {
        setIsUploadReceiptOpen(false);
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay-payment">
            <div className="modal-content-payment">
                <h2 className="modal-title-payment">Seleccione el Método de Pago</h2>
                <div className="modal-buttons-payment">
                    <button className="modal-button-payment" onClick={handleCardPaymentSelect}>
                        <span className="icon"><FontAwesomeIcon icon={faCreditCard} /></span>
                        <span className="text">Tarjeta</span>
                    </button>
                    <button className="modal-button-payment" onClick={handleReceiptUploadSelect}>
                        <span className="icon"><FontAwesomeIcon icon={faArrowUpFromBracket} /></span>
                        <span className="text">Comprobante de SINPE</span>
                    </button>
                    <button className="modal-close-payment" style={{ color: "white" }} onClick={onClose}>Cancelar</button>
                </div>
            </div>
            {isCardPaymentOpen && <CardPaymentFormModal id={id} onClose={handleCloseCardPayment} />}
            {isUploadReceiptOpen && <UploadReceiptModal id={id} onClose={handleCloseUploadReceipt} />}
        </div>,
        document.body
    );
};

PaymentModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSelectPayment: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default PaymentModal;
