import { faUserPlus, faRightToBracket, faMagnifyingGlass, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
export const cardsInfo = [
    {
        icon: faUserPlus,
        title: 'Registrarse',
        description: 'Crea una cuenta para acceder al sistema de gestión de multas.',
        link: '/registro'
    },
    {
        icon: faRightToBracket,
        title: 'Iniciar sesión',
        description: 'Inicia sesión para acceder al sistema de gestión de multas.',
        link: '/login'
    },
    {
        icon: faMagnifyingGlass,
        title: 'Consulta pública',
        description: 'Realice la consulta pública que necesite.',
        link: '/*'
    },
    {
        icon: faMapLocationDot,
        title: 'Mapa de calor de multas',
        description: 'Consulte el mapa de calor con las áreas con más infracciones de tránsito.',
        link: '/mapa-de-calor'
    }
]