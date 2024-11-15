import { createContext } from "react";

const initialState = {
    tickets: [],
    setTickets: () => { },
    refetchTickets: () => { },
}


// Se crea el contexto de autenticación
export const TicketsContext = createContext(initialState);