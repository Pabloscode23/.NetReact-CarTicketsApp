
import { faUserPlus, faRightToBracket, faMagnifyingGlass, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import '../styles/InitialHome.css';
import { HomeCard } from './HomeCard';
export const InitialHome = () => {
    const cardsInfo = [
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

    return (
        <>
            <div className="container">
                <h1 className="main-title">Bienvenido(a)</h1>
                <h2 className="subtitle">Por favor seleccione lo que desea hacer</h2>
                <div className="cards">
                    {cardsInfo.map((card, index) => (
                        <HomeCard key={index} icon={card.icon} title={card.title} description={card.description} link={card.link} />
                    ))}

                </div>
            </div>

        </>
    )
}
