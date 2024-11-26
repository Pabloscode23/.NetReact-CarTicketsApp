import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../styles/PublicRequestPage.css";
import { API_URL } from "../../../constants/Api";
import ReCAPTCHA from "react-google-recaptcha"; // Import the reCAPTCHA component

export const PublicResquestPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            number: "",
        },
    });

    const [fineResults, setFineResults] = useState(null);
    const [queryError, setQueryError] = useState(null);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [captchaError, setCaptchaError] = useState(null);

    // Function to handle reCAPTCHA
    const onCaptchaChange = (token) => {
        setCaptchaToken(token);
        setCaptchaError(null); // Clear any previous captcha errors
    };



    const onSubmit = handleSubmit(async (data) => {
        if (!captchaToken) {
            setCaptchaError("Por favor verifique que no es un robot.");
            return;
        }
        console.log(data);
        reset();
        try {
            const response = await axios.get(`${API_URL}/TicketDTO/search`, {
                params: { placa: data.number },
            });

            if (response.status === 200 && response.data.length > 0) {
                setFineResults(response.data); // Guarda las multas
                setQueryError(null); // Limpia errores previos
            } else {
                throw new Error("No se encontraron multas asociadas a este número de placa.");
            }
        } catch (error) {
            setQueryError(error.response?.data || "Error al consultar las multas.");
            setFineResults(null); // Limpia resultados previos
        }
    });

    return (
        <div className="main-container">
            <div className="requestpage-request">
                <h1 className="requestpage__title title-request">Consulta pública de multas</h1>
                <form className="requestpage__form" onSubmit={onSubmit}>
                    <div className="requestpage__inputs">
                        <div className="login-form__field">
                            <label className="login-form__label">Ingrese su número de placa</label>
                            <input
                                className="login-form__input"
                                type="text"
                                name="number"
                                {...register("number", {
                                    required: "Número de placa es requerido",
                                    pattern: {
                                        value: /^[a-zA-Z0-9- ]+$/,
                                        message: "Verifique que el número de placa sea válido",
                                    },
                                })}
                            />
                            {errors.number && (
                                <span className="login-form__error">{errors.number.message}</span>
                            )}
                        </div>

                        {/* ReCAPTCHA dentro del cuadro azul */}
                        <div className="captcha-field">
                            <label className="login-form__label">Verificación CAPTCHA</label>
                            <ReCAPTCHA
                                sitekey="6LdSQmgqAAAAAKxwVm9RCC-b0MtyxmucFimK57UE"
                                onChange={onCaptchaChange}
                            />
                            {captchaError && <span className="login-form__error">{captchaError}</span>}
                        </div>
                    </div>

                    <div className="requestpage__actions">
                        <button className="requestpage__button" type="submit">
                            Consultar
                        </button>
                    </div>
                </form>
            </div>

            {/* Contenedor separado para los resultados */}
            {(fineResults || queryError) && (
                <div className="results-container">
                    <div className="results-box">
                        <h2>Resultados</h2>
                        {queryError && <p className="error-message">{queryError}</p>}
                        {fineResults && (
                            <div className="fine-results">
                                <h2>Multas asociadas:</h2>
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            <th>ID Multa</th>
                                            <th>Fecha</th>
                                            <th>Monto</th>
                                            <th>Descripción</th>
                                            <th>Estado</th>
                                            <th>Oficial</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fineResults.map((fine, index) => (
                                            <tr key={index}>
                                                <td>{fine.id}</td>
                                                <td>{new Date(fine.date).toLocaleDateString()}</td>
                                                <td>${fine.amount.toLocaleString()}</td>
                                                <td>{fine.description}</td>
                                                <td>{fine.status}</td>
                                                <td>{fine.officerId}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
