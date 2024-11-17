// constants/rolePermissions.js

export const RolePermissions = {
    admin: ["create_users", "view_tickets", "view_roles", "create_reports", "Plate_Detection", "edit_profile"], // Add all admin permissions
    usuario: ["view_user-tickets", "view_claims", "edit_profile"], // Add user permissions
    oficial: ["create_ticket", "history_tickets", "history_claims", "edit_profile", "Plate_Detection"], // Add official permissions
    juez: ["respond_claims", "history_claims", "edit_profile"], // Add judge permissions
};
