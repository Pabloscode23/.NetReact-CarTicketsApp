import { createContext } from "react";

const initialState = {
    token: null,
    user: null,
    setToken: () => { },
    setUser: () => { },
}


// Se crea el contexto de autenticación
export const AuthContext = createContext(initialState);
