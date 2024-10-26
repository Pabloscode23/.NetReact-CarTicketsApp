import { memo, useMemo, useState } from 'react';
import { ModalContext } from './ModalContext';
import { GlobalModal } from '../components/GlobalModal';

export const ModalProvider = memo(({ children }) => {
    const [content, setContent_] = useState(<></>);
    const [open, setOpen_] = useState(false);

    const openModal = (content) => {
        setContent_(content);
        setOpen_(true);
    }

    const closeModal = () => {
        setContent_(<></>);
        setOpen_(false);
    }

    const contextValue = useMemo(
        () => ({
            content,
            openModal,
            closeModal, // Provide the user with permissions
        }),
        [content]
    );

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            <GlobalModal open={open}>
                {content}
            </GlobalModal>
        </ModalContext.Provider>
    )
})
