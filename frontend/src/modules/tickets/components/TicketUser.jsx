import { useState } from 'react';
import PropTypes from 'prop-types';
import { PaymentModal } from './PaymentModal';

export const TicketUser = ({ id, date, reason, amount, status, onReclamar, isClaimed, isPayed }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSelectPayment = (method) => {
        console.log(`Método de pago seleccionado: ${method}`);
        handleCloseModal();
    };

    return (
        <>
            <tr>
                <td>{id}</td>
                <td>{date}</td>
                <td>{reason}</td>
                <td>{amount}</td>
                <td>{status}</td>
                <td className='table__buttons'>
                    <button onClick={onReclamar} disabled={isClaimed || status == "Pagada"}>Reclamar</button>
                    <button id={id} disabled={isPayed} onClick={handleOpenModal}>Pagar</button>
                </td>
            </tr>
            {isModalOpen && (
                <PaymentModal id={id} onClose={handleCloseModal} onSelectPayment={handleSelectPayment} />
            )}
        </>
    );
};

TicketUser.propTypes = {
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onReclamar: PropTypes.func.isRequired,
    isClaimed: PropTypes.bool.isRequired,
};
