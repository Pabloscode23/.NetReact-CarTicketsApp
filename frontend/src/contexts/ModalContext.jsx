import { createContext } from "react"



const initialState = {
    content: <></>,
    openModal: () => { },
    closeModal: () => { },
}

export const ModalContext = createContext(initialState);