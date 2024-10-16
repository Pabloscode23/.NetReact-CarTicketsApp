// constants/rolePermissions.js

export const RolePermissions = {
    admin: ["create_users", "view_tickets", "view_roles", "create_reports", "create_ticket_from_image"], // Add all admin permissions
    usuario: ["view_user-tickets", "view_claims", "edit_profile"], // Add user permissions
    oficial: ["create_ticket", "edit_ticket", "history_claims", "edit_profile"], // Add official permissions
    juez: ["respond_claims", "history_claims", "edit_profile"], // Add judge permissions
};
