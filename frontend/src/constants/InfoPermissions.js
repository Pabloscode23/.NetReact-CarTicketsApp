import { faCamera, faCircleExclamation, faCirclePlus, faClockRotateLeft, faFileLines, faFileSignature, faFolderOpen, faMagnifyingGlass, faMapLocationDot, faPenToSquare, faRightToBracket, faUserGear, faUserPlus, faUsers, faUserTag } from '@fortawesome/free-solid-svg-icons';

export const InfoPermissions = {

    //Admin
    "create_users": {
        icon: faUsers,
        title: 'Gestión de usuarios',
        description: 'Administra los usuarios del sistema.',
        link: '/gestion/usuarios'
    },
    "view_tickets": {
        icon: faFileLines,
        title: 'Catálogo de multas',
        description: 'Administra el catálogo de multas del sistema.',
        link: '/gestion/multas'
    },
    "view_roles": {
        icon: faUserTag,
        title: 'Roles y permisos',
        description: 'Administra los roles y permisos del sistema.',
        link: '/gestion/roles'
    },
    "create_reports": {
        icon: faFileSignature,
        title: 'Gestión de informes',
        description: 'Genere informes sobre el estado y gestión de multas en el sistema.',
        link: '/gestion/informes'
    },
    "plate_detection": {
        icon: faCamera,
        title: 'Multa automática',
        description: 'Suba una imagen para generar una multa automática.',
        link: 'imagen'
    },

    //Usuario final
    "view_user-tickets": {
        icon: faFileLines,
        title: 'Multas',
        description: 'Aquí podrá consultar sus multas, presentar reclamos y/o pagarlas.',
        link: '/multas-usuario'
    },
    "view_claims": {
        icon: faCircleExclamation,
        title: 'Reclamos',
        description: 'Aquí podrá consultar sus reclamos presentados.',
        link: '/reclamos-usuario'
    },
    "edit_profile": {
        icon: faUserGear,
        title: 'Gestionar perfil',
        description: 'Aquí podrá gestionar su cuenta de usuario y realizar cambios en su perfil.',
        link: '/perfil'
    },

    //Oficial
    "create_ticket": {
        icon: faCirclePlus,
        title: 'Crear multa',
        description: 'Aquí podrá crear una multa en el sistema.',
        link: '/multas/crear'
    },
    "edit_ticket": {
        icon: faPenToSquare,
        title: 'Editar multa',
        description: 'Aquí podrá editar una multa en el sistema.',
        link: '/multas/editar/:id'
    },
    "history_tickets": {
        icon: faFolderOpen,
        title: 'Historial de multas',
        description: 'Aquí podrá ver el historial de multas creadas.',
        link: '/multas/historial'
    },
    "history_claims": {
        icon: faClockRotateLeft,
        title: 'Historial de reclamos',
        description: 'Aquí podrá consultar los reclamos presentados en relación a las multas.',
        link: '/multas/reclamos'
    },
    //juez
    "respond_claims": {
        icon: faCircleExclamation,
        title: 'Resolver reclamos',
        description: 'Gestionar las quejas o inconformidades presentadas por los usuarios.',
        link: '/juez-reclamos'
    },

    //generales
    "regist": {
        icon: faUserPlus,
        title: 'Registrarse',
        description: 'Crea una cuenta para acceder al sistema de gestión de multas.',
        link: '/registro'
    },
    "login": {
        icon: faRightToBracket,
        title: 'Iniciar sesión',
        description: 'Inicia sesión para acceder al sistema de gestión de multas.',
        link: '/login'
    },
    "public-request": {
        icon: faMagnifyingGlass,
        title: 'Consulta pública',
        description: 'Realice la consulta pública que necesite.',
        link: '/consulta-publica'
    },
    "heat-map": {
        icon: faMapLocationDot,
        title: 'Mapa de calor de multas',
        description: 'Consulte el mapa de calor con las áreas con más infracciones de tránsito.',
        link: '/mapa-de-calor'
    },
    "dashboard": {
        title: 'Inicio',
        link: '/'
    }
}