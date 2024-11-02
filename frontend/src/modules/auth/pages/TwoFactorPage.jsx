import { useState } from "react";
import { useForm } from "react-hook-form";
import '../styles/TwoFactorPage.css';
import { useAuth } from "../../../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../constants/Api";
import axios from "axios";

export const TwoFactorPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: { code: "" } });
    const { setToken, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar el mensaje de error

    const onSubmit = handleSubmit((data) => {

        const request = {
            Email: email,
            Code: data.code
        }

        axios.post(`${API_URL}/Auth/ValidateCode2FA`, request)
            .then(response => {
                if (response.status === 200) {
                    reset();
                    setToken(response.data.token);
                    setUser(response.data.user);
                    navigate("/", { replace: true });
                    setErrorMessage(""); // Reiniciar mensaje de error
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error("Error details:", error.response);

                    if (error.response.status === 401) {
                        setErrorMessage("Código incorrecto. Por favor, inténtalo de nuevo.");
                    } else if (error.response.status === 500) {
                        setErrorMessage("Un error inesperado ha ocurrido. Por favor, inténtelo de nuevo.");
                    }
                } else {
                    setErrorMessage("Error de conexión. Por favor, inténtelo de nuevo.");
                }
                console.error("Login fallado:", error.message);
            })
    });

    return (
        <div className="two-factor">
            <h1 className="two-factor__title">Confirmación de código</h1>
            <form className="two-factor__form" onSubmit={onSubmit}>
                <div className="two-factor__inputs">
                    <div className="two-factor__field">
                        <label className="two-factor__label">Ingrese el código de verificación</label>
                        <input
                            className={`two-factor__input ${errors.code ? "two-factor__input--error" : ""}`}
                            type="text"
                            {...register("code", {
                                required: "Código es requerido",
                                pattern: { value: /^[0-9]*$/, message: "El código solo acepta números" },
                                minLength: { value: 6, message: "El código debe tener al menos 6 caracteres" },
                            })}
                        />
                        {errors.code && <span className="two-factor__error">{errors.code.message}</span>}
                        {errorMessage && <div className="two-factor__error-message">{errorMessage}</div>} {/* Mostrar mensaje de error */}
                    </div>
                </div>
                <div className="two-factor__actions">
                    <button className="two-factor__button" type="submit">Verificar</button>
                </div>
            </form>
        </div>
    );
};