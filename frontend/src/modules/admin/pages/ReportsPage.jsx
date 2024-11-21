import "../styles/ReportsPage.css";


export const ReportsPage = () => {
    return (
        <div className="report-generation-container">
            <h1>Generación de Informes</h1>
            <p>Seleccione el tipo de informe que desea generar</p>

            <div className="form-section">
                <label htmlFor="report-type">Seleccione un tipo de informe</label>
                <select id="report-type">
                    <option>Seleccione</option>
                    <option>Informe sobre multas</option>
                    <option>Informe sobre reclamos</option>
                    <option>Informe sobre pagos</option>
                    <option>Informe sobre usuarios</option>
                </select>
                <button>Generar Informe</button>
            </div>

            <div className="email-section">
                <input type="email" id="email" placeholder="Ingrese la dirección de correo" />
                <button>Enviar Informe</button>
            </div>
        </div>
    )
}
