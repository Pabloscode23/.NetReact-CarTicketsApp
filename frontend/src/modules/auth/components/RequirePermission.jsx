import { useAuth } from "../../../hooks";

export const RequirePermission = ({ permission, children }) => {
    const { user } = useAuth();

    if (!user) return null;
    const permissions = user.role.permissions || [];

    return permissions.includes(permission) ? children : null;
}
