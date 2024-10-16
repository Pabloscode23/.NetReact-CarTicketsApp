import axios from "axios";
import { memo, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";


// Se crea el proveedor de autenticación
export const AuthProvider = memo(({ children }) => {
    // Se obtiene el token de autenticación del local storage
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [user, setUser_] = useState();

    // Función para actualizar el token de autenticación
    const setToken = (newToken) => {
        setToken_(newToken);
    };

    const setUser = (newUser) => {
        setUser_(newUser);
    }

    // Se actualiza el token de autenticación en las cabeceras de axios
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem('token')
        }
        setUser({ name: "Santiago", role: { name: 'admin', permissions: ["Ver pagos", "Ver multas", "Ver perfil"] } })
    }, [token]);

    // Valor memoizado del contexto de autenticación
    const contextValue = useMemo(
        () => ({
            token,
            setToken,
            user,
            setUser
        }),
        [token, user]
    );

    // Provee el contexto de autenticación a los componentes hijos
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
});

/* {
    name: "Santiago",
        role: {
            name: 'admin',
                permissions: ["Ver pagos", "Ver multas", "Ver perfil"]
    }
} */