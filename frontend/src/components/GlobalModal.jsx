import PropTypes from 'prop-types';
import '../styles/Modal.css';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from '../hooks/useModal';

export const GlobalModal = ({ children, open }) => {
    const { closeModal } = useModal();

    const handleClickOutside = () => {
        closeModal();
    };

    return (
        <>
            <div
                className={`modal ${open ? "modal-open" : ""}`}
                role="dialog"
                aria-modal="true"
            >
                <div onClick={() => closeModal()} className='container__button__modal'>
                    <FontAwesomeIcon icon={faXmark} size='2xl' className='icon' />
                </div>
                {children}
            </div>
            <div onClick={handleClickOutside} style={{ display: open ? "block" : "none", position: 'absolute', width: "100vw", height: "100vh", background: "transparent", top: "0", cursor: "pointer", zIndex: '900' }} >

            </div>
        </>
    );
};

GlobalModal.propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
};
