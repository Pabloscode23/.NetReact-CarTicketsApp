// Desc: Hook para verificar los permisos de un usuario

export const validatePermission = ({ userRole, permission }) => {

    if (!userRole.permissions.includes(permission)) {
        return false
    } else {
        return true
    }
}
