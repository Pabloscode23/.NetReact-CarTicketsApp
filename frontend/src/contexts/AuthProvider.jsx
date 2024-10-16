import axios from "axios";
import { memo, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { RolePermissions } from "../constants/RolePermissions"; // Import role permissions

// Create the authentication provider
// eslint-disable-next-line react/display-name
export const AuthProvider = memo(({ children }) => {
    // Get the authentication token from local storage
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [user, setUser_] = useState(null); // Initialize user as null

    // Function to update the authentication token
    const setToken = (newToken) => {
        setToken_(newToken);
    };

    // Function to update the user and assign permissions based on role or specific permissions
    const setUser = (newUser) => {
        // Check if the user has a role and assign permissions accordingly
        const permissions = newUser?.role
            ? RolePermissions[newUser.role.name] || []  // Assign permissions based on role
            : newUser?.permissions || [];                // Assign directly if no role is present
        setUser_({ ...newUser, permissions });
    };

    // Update the authentication token in axios headers
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem('token');
            setUser(null); // Reset user when not logged in
        }

        // Simulate setting the user (replace with actual user fetch logic)
        const exampleUser = { name: "Santiago", role: { name: 'oficial' } }; // Example user data
        setUser(exampleUser); // This will set the user and assign permissions based on the role
    }, [token]);

    // Define default permissions for unauthenticated users
    const defaultPermissions = ["view_tickets", "edit_profile"]; // Adjust this list as needed

    // If no user is logged in, assign default permissions
    const userWithPermissions = user
        ? user
        : { name: "Guest", permissions: defaultPermissions }; // Default user structure for unauthenticated users

    // Memoized context value
    const contextValue = useMemo(
        () => ({
            token,
            setToken,
            user: userWithPermissions, // Always provide user with permissions
            setUser
        }),
        [token, userWithPermissions]
    );

    // Provide the authentication context to child components
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
});
