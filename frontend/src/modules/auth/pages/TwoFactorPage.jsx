import { useForm } from "react-hook-form";
import '../styles/TwoFactorPage.css';
import { useAuth } from "../../../hooks";
import { useNavigate } from "react-router-dom";

export const TwoFactorPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            code: "",
        },
    });
    // Se usa el custom hook para obtener la función setToken que asigna el token de autenticación
    const { setToken, setUser } = useAuth();

    // Se usa el hook de navegación para redirigir a la página principal
    const navigate = useNavigate();
    const onSubmit = handleSubmit((data) => {
        console.log(data);
        reset();
        setToken('token de prueba');

        setUser({ name: data.email, role: { name: 'admin', permissions: ["Ver multas", "Ver reclamos", "Ver perfil"] } });
        navigate('/', { replace: true });
    });

    return (
        <div className="two-factor">
            <h1 className="two-factor__title">Confirmación de código</h1>
            <form className="two-factor__form" onSubmit={onSubmit}>
                <div className="two-factor__inputs">
                    <div className="two-factor__field">
                        <label className="two-factor__label">Ingrese el código de verificación</label>
                        <input
                            className="two-factor__input"
                            type="text"
                            name="code"
                            {...register("code", {
                                required: "Código es requerido",
                                pattern: { value: /^[a-zA-Z0-9]*$/, message: "Código solo acepta letras y números" }
                            })}
                        />
                        {errors.code && (
                            <span className="two-factor__error">{errors.code.message}</span>
                        )}
                    </div>
                </div>
                <div className="two-factor__actions">
                    <button className="two-factor__button" type="submit">Verificar</button>
                </div>
            </form>
        </div>

    );
};
