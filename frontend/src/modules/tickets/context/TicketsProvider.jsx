import axios from "axios";
import { memo, useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
import { API_URL } from "../../../constants/Api";
import { TicketsContext } from "./TicketsContext";

// Create the authentication provider
// eslint-disable-next-line react/display-name
export const TicketsProvider = memo(({ children }) => {
=======
import { AuthContext } from "./AuthContext";
import { RolePermissions } from "../constants/RolePermissions"; // Import role permissions
import { API_URL } from "../constants/Api";

// Create the authentication provider
// eslint-disable-next-line react/display-name
export const AuthProvider = memo(({ children }) => {
>>>>>>> 2d6f87bc512f9b3f7587975660f615dae7735587
    // State to hold the token
    const [tickets, setTickets_] = useState([]);

    // Function to update the authentication token
    const setTickets = (newTickets) => {
        setTickets_(newTickets);
    };

    const refetchTickets = () => {
        fetchTickets();
    };

    const fetchTickets = async () => {
        try {
            const response = await axios.get(`${API_URL}/TicketDTO`);
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    // Update Axios authorization headers whenever the token changes
    useEffect(() => {
        fetchTickets();
    }, []);


    // Memoize the context value to optimize performance
    const contextValue = useMemo(
        () => ({
            tickets,
            setTickets,
            refetchTickets
        }),
        [tickets]
    );

    return (
<<<<<<< HEAD
        <TicketsContext.Provider value={contextValue}>
            {children}
        </TicketsContext.Provider>
    );
});
=======
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
});
>>>>>>> 2d6f87bc512f9b3f7587975660f615dae7735587
