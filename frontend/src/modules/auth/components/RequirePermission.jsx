import { useAuth } from "../../../hooks";

export const RequirePermission = ({ permission, children }) => {
    const { permissions } = useAuth(); // Get permissions from context

    // Return children if permission exists in permissions state, otherwise return null
    return permissions.includes(permission) ? children : null;
};
