import { faCamera, faCircleExclamation, faCirclePlus, faClockRotateLeft, faFileLines, faFileSignature, faMagnifyingGlass, faMapLocationDot, faPenToSquare, faRightToBracket, faUserGear, faUserPlus, faUsers, faUserTag } from '@fortawesome/free-solid-svg-icons';

export const InfoPermissions = {

    //Admin
    "create_users": {
        icon: faUsers,
        title: 'Gestion de usuarios',
        description: 'Administra los usuarios del sistema.',
        link: '/gestion/usuarios'
    },
    "view_tickets": {
        icon: faFileLines,
        title: 'Gestion catálogo de multas',
        description: 'Administra el catálogo de multas del sistema.',
        link: '/gestion/multas'
    }, "view_roles": {
        icon: faUserTag,
        title: 'Gestion de roles y permisos',
        description: 'Administra los roles y permisos del sistema.',
        link: '/gestion/roles'
    },
    "create_reports": {
        icon: faFileSignature,
        title: 'Gestion de informes',
        description: 'Genere informes sobre el estado y gestión de multas en el sistema.',
        link: '/gestion/informes'
    },
    "create_ticket_from_image": {
        icon: faCamera,
        title: 'Carga de imágenes de placas',
        description: 'Suba imágenes de placas de vehículos relacionadas con multas de tránsito.',
        link: '/gestion/carga-imagenes'
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
        description: 'Aquí podrá gestionar su cuenta de usuario, como cambiar su contraseña.',
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
    "history_claims": {
        icon: faClockRotateLeft,
        title: 'Historial de reclamos',
        description: 'Aquí podrá consultar los reclamos presentados en relación a las multas.',
        link: '/historial-reclamos'
    },
    //juez
    "respond_claims": {
        icon: faCircleExclamation,
        title: 'Resolver reclamos',
        description: 'Gestionar las quejas o inconformidades presentadas por los usuarios.',
        link: '/reclamos'
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
        link: '/*'
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