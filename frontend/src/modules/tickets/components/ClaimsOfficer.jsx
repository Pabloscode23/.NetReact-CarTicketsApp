import { useState } from 'react';
import PropTypes from 'prop-types';
import { PaymentModal } from './PaymentModal';

export const ClaimsOfficer = ({ id, date, reason, amount, status, onReclamar, isClaimed, isPayed }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSelectPayment = (method) => {
        console.log(`Método de pago seleccionado: ${method}`);
        handleCloseModal();
    };

    const buttonStyle = (disabled) => ({
        backgroundColor: disabled ? '#6C757D' : '', // Cambia el fondo a gris si está deshabilitado
        cursor: disabled ? 'not-allowed' : 'pointer', // Cambia el cursor a no permitido si está deshabilitado
    });

    return (
        <>
            <tr>
                <td>{id}</td>
                <td>{date}</td>
                <td>{reason}</td>
                <td>{amount}</td>
                <td>{status}</td>
            </tr>
            {isModalOpen && (
                <PaymentModal id={id} onClose={handleCloseModal} onSelectPayment={handleSelectPayment} />
            )}
        </>
    );
};

ClaimsOfficer.propTypes = {
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onReclamar: PropTypes.func.isRequired,
    isClaimed: PropTypes.bool.isRequired,
};
