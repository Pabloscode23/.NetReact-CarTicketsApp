import { useState } from "react";
import "../styles/ReportsPage.css";
import axios from "axios";
import { API_URL } from "../../../constants/Api";
import { showErrorAlert, showSuccessAlert } from "../../../constants/Swal/SwalFunctions";
import { Loader } from "../../../components/Loader";


export const ReportsPage = () => {
    const [reportType, setReportType] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const sendReport = () => {
        const formData = {
            email,
            reportType
        };
        setLoading(true);
        axios.post(`${API_URL}/Report`, formData).then((response) => {
            if (response.status === 200) {
                setLoading(false);
                showSuccessAlert('Informe generado exitosamente');
            }
        }).catch((error) => {
            showErrorAlert('Error al generar el informe');
            console.error('Error al generar el informe:', error);
        }).finally(() => {
            setEmail('');
            setReportType('');
        });
    }

    return (
        <div className="report-generation-container">
            <h1>Generación de Informes</h1>
            <p>Seleccione el tipo de informe que desea generar</p>

            <div className="form-section">
                <label htmlFor="report-type">Seleccione un tipo de informe</label>
                <select className="slct" id="report-type" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value={""}>Seleccione</option>
                    <option value="Tickets">Informe sobre multas</option>
                    <option value="Claims">Informe sobre reclamos</option>
                    <option value="Payments">Informe sobre pagos</option>
                </select>
            </div>

            <div className="email-section">
                <input className="email-inp" onChange={(e) => setEmail(e.target.value)} type="email" value={email} id="email" placeholder="Ingrese la dirección de correo" />
                <button onClick={sendReport} className="report-btn">Enviar Informe</button>
            </div>
            {
                loading && <div className="loader">
                    <Loader />
                </div>
            }
        </div>
    )
}
