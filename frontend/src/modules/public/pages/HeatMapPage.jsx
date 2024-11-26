import HeatMap from "../components/HeatMap";

const HeatMapPage = () => {
    return (
        <div>
            <h1 className='main__ticket-title'>Mapa de calor de multas</h1>
            <h2 className='main__ticket-subtitle'>Visualice el mapa de calor para las multas creadas</h2>
            <HeatMap />
        </div>
    )
}
export default HeatMapPage;