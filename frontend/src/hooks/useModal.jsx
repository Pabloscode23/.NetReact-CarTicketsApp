

import { useContext } from 'react'
import { ModalContext } from '../contexts';

export const useModal = () => {
    return useContext(ModalContext);
}
