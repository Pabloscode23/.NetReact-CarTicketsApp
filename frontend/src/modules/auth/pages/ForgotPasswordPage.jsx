import { useForm } from "react-hook-form";
import '../styles/TwoFactorPage.css';
import { useNavigate } from "react-router-dom";

export const ForgotPasswordPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            email: "",
        },
    });
    // Se usa el hook de navegación para redirigir a la página principal
    const navigate = useNavigate();
    const onSubmit = handleSubmit((data) => {
        console.log(data);
        reset();
        navigate('/login', { replace: true });
    });

    return (
        <div className="two-factor">
            <h1 className="two-factor__title">Recuperar su contraseña</h1>
            <form className="two-factor__form" onSubmit={onSubmit}>
                <div className="two-factor__inputs">
                    <div className="login-form__field">
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