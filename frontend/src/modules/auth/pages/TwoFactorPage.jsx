import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import '../styles/TwoFactorPage.css';
import { useAuth } from "../../../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../constants/Api";

export const TwoFactorPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: { code: "" } });
    const { setToken, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [generatedCode, setGeneratedCode] = useState("");
    const hasSentCode = useRef(false); // Usar useRef para controlar si el código ha sido enviado
    const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar el mensaje de error

    // Enviar el código de 2FA al correo cuando se cargue la página
    useEffect(() => {
        const sendTwoFactorCode = async () => {
            if (!email || hasSentCode.current) return; // No enviar si no hay email o si ya se envió

            const code = generateTwoFactorCode();
            setGeneratedCode(code);
            hasSentCode.current = true; // Marcar como enviado

            try {
                const response = await fetch(`${API_URL}/notification/send`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: `Este es tu código de verificación: ${code}`,
                        recipient: email
                    })
                });

                if (!response.ok) {
                    throw new Error("Error al enviar el código de verificación");
                }

                console.log("Código de verificación enviado a:", email);
            } catch (error) {
                console.error("Error al enviar el código de verificación:", error);
            }
        };

        sendTwoFactorCode();
    }, [email]); // Solo depende del email

    const generateTwoFactorCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const onSubmit = handleSubmit((data) => {
        console.log("Código ingresado:", data.code);
        if (data.code === generatedCode) {
            reset();
            setToken("token de prueba");
            setUser({ name: "Usuario", role: { name: "admin", permissions: ["Ver multas", "Ver reclamos", "Ver perfil"] } });
            navigate("/", { replace: true });
            setErrorMessage(""); // Reiniciar mensaje de error
        } else {
            setErrorMessage("Código incorrecto. Por favor, inténtalo de nuevo."); // Establecer mensaje de error
        }
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