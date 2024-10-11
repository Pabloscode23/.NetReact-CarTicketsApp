import { cardsInfo } from '../../../constants/CardsInfo';
import '../styles/InitialHome.css';
import { HomeCard } from './HomeCard';
export const InitialHome = () => {

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
