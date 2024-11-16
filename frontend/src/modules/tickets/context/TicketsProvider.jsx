import axios from "axios";
import { memo, useEffect, useMemo, useState } from "react";
import { API_URL } from "../../../constants/Api";
import { TicketsContext } from "./TicketsContext";

// Create the authentication provider
// eslint-disable-next-line react/display-name
export const TicketsProvider = memo(({ children }) => {
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
        <TicketsContext.Provider value={contextValue}>
            {children}
        </TicketsContext.Provider>
    );
});