import { useForm } from "react-hook-form";
import '../styles/TwoFactorPage.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../constants/Api";
import { useState } from "react";

export const ForgotPasswordPage = () => {
    const [error, setError] = useState(null);
    const [msg, setMsg] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
        },
    });
    // Se usa el hook de navegación para redirigir a la página principal
    const navigate = useNavigate();
    const onSubmit = handleSubmit((data) => {
        console.log(data);

        axios.post(`${API_URL}/Auth/RecoverPassword`, data).then((response) => {
            if (response.status === 200) {
                setMsg("Correo enviado correctamente");
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
                setError(null);
            }
        }).catch((error) => {
            if (error.status === 404) {
                setError("Este correo no está registrado.");
                setTimeout(() => {
                    setError(null);
                }, 3000);
            }
        });

    });

    return (
        <div className="two-factor">
            <h1 className="two-factor__title">Recuperar contraseña</h1>
            <form className="two-factor__form" onSubmit={onSubmit}>
                <div className="two-factor__inputs">
                    <div className="login-form__field">
                        {msg && <span className="login-form__msg">{msg}</span>}
                        <label className="login-form__label">Ingrese su correo electrónico</label>
                        <input
                            className="login-form__input"
                            type="email"
                            name="email"
                            {...register("email", {
                                required: "Correo electrónico es requerido",
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                    message: "Verifique que el correo electrónico sea válido",
                                },
                            })}
                        />
                        {errors.email && (
                            <span className="login-form__error">{errors.email.message}</span>
                        )}
                        {error && (
                            <span className="login-form__error">{error}</span>
                        )}
                    </div>
                </div>
                <div className="two-factor__actions">
                    <button className="two-factor__button" type="submit">Enviar correo de recuperación</button>
                </div>
            </form>
        </div>

    );
};
{/*Este comentario es de prueba*/ }