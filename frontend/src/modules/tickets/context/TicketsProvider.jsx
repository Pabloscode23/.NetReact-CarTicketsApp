import axios from "axios";
import { memo, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { RolePermissions } from "../constants/RolePermissions"; // Import role permissions
import { API_URL } from "../constants/Api";

// Create the authentication provider
// eslint-disable-next-line react/display-name
export const AuthProvider = memo(({ children }) => {
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
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
});
