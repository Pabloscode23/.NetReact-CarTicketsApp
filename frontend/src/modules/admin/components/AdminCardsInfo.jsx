import { faCamera, faFile, faFileLines, faUsers, faUserShield } from '@fortawesome/free-solid-svg-icons';
export const cardsAdminInfo = [
    //TODO: links que sean de gestion propiamente, objeto en objeto
    //importar su permissions al file



    {
        Permissions.el que tenga: {
            icon: faUsers,
            title: 'Gestión de usuarios',
            description: 'Administre usuarios, cree nuevos o edite los existentes.',
            link: '/user-manage'
        }
    },
    {
        icon: faFile,
        title: 'Gestión de catálogo de multas',
        description: 'Administre el catálogo de multas, cree nuevas o edite las existentes.',
        link: '/tickets'
    },
    {
        icon: faUserShield,
        title: 'Gestionar roles y permisos',
        description: 'Administre los roles y permisos de los usuarios en el sistema.',
        link: '/rol-permission'
    }, {
        icon: faFileLines,
        title: 'Informes',
        description: 'Genere informes sobre el estado y gestión de las multas en el sistema.',
        link: '/reports'
    }, {
        icon: faCamera,
        title: 'Carga de imágenes de placas',
        description: 'Suba imágenes de placas de vehículos relacionadas con las multas de tránsito.',
        link: '/plate-image'
    }
]