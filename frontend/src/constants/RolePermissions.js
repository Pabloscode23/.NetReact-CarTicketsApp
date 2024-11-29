export const RolePermissions = {
    admin: ["create_users", "view_tickets", "view_roles", "create_reports", "plate_detection", "edit_profile", "view_ticket_types"], // Add all admin permissions
    usuario: ["view_user-tickets", "view_claims", "edit_profile"], // Add user permissions
    oficial: ["create_ticket", "history_tickets", "history_claims", "plate_detection", "edit_profile"], // Add official permissions
    juez: ["respond_claims", "history_claims", "edit_profile"], // Add judge permissions
};
