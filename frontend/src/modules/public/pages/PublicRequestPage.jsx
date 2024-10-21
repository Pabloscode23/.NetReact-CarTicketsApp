import { useForm } from "react-hook-form";
import '../../../../src/modules/auth/styles/TwoFactorPage.css';
import { useNavigate } from "react-router-dom";

export const PublicResquestPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            number: "",
        },
    });
    // Se usa el hook de navegación para redirigir a la página principal
    const navigate = useNavigate();
    const onSubmit = handleSubmit((data) => {
        console.log(data);
        reset();
        navigate('/', { replace: true });
    });

    return (
        <div className="two-factor">
            <h1 className="two-factor__title">Consulta pública de multas</h1>
            <form className="two-factor__form" onSubmit={onSubmit}>
                <div className="two-factor__inputs">
                    <div className="login-form__field">
                        <label className="login-form__label">Ingrese su número de placa</label>
                        <input
                            className="login-form__input"
                            type="text"
                            name="number"
                            {...register("email", {
                                required: "Número de placa es requerido",
                                pattern: {
                                    value: /^[a-zA-Z0-9-]+$/,
                                    message: "Verifique que el número de placa sea válido",
                                },
                            })}
                        />
                        {errors.email && (
                            <span className="login-form__error">{errors.email.message}</span>
                        )}
                    </div>
                </div>
                <label className="login-form__label">Verificación Captcha</label>

                {/* Sección de captcha */}
                <div className="two-factor__actions">
                    <button className="two-factor__button" type="submit">Consultar</button>
                </div>
            </form>
        </div>

    );
};
