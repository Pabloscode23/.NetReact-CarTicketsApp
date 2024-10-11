import { useForm } from "react-hook-form";
import '../styles/LoginPage.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks";

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });
    // Se usa el custom hook para obtener la función setToken que asigna el token de autenticación
    const { setToken } = useAuth();

    // Se usa el hook de navegación para redirigir a la página principal
    const navigate = useNavigate();
    const onSubmit = handleSubmit((data) => {
        console.log(data);
        reset();
        setToken('token de prueba');
        navigate('/', { replace: true });
    });

    return (
        <div className="login-form">
            <h1>Iniciar sesión</h1>
            <form className="login-form__body" onSubmit={onSubmit}>
                <div className="login-form-inputs">
                    <div className="login-form__field">
                        <label className="login-form__label">Correo electrónico</label>
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

                    <div className="login-form__field">
                        <label className="login-form__label">Contraseña</label>
                        <input
                            className="login-form__input"
                            type="password"
                            name="password"
                            {...register("password", {
                                required: "Contrseña es requerida",
                                minLength: {
                                    value: 8,
                                    message: "Contraseña debe tener al menos 8 caracteres",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: "Contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número",
                                },
                            })}
                        />
                        {errors.password && (
                            <span className="login-form__error">{errors.password.message}</span>
                        )}
                    </div>
                </div>
                <div className="login-form__actions">
                    <button className="login-form__button" type="submit">Ingresar</button>
                </div>
                <div className="login-form-indications">
                    <div className="login-form-recoverpassword">
                        <p className="login-form-text">¿Quieres recuperar tu contraseña?</p>
                        <Link to="/olvide-contrasena" className="login-link">Ingresa aquí</Link>
                    </div>
                    <p className="form-line"></p>
                    <div className="login-form-regist">
                        <p className="login-form-text">¿No tienes cuenta?</p>
                        <Link to="/registro" className="login-link">Crear cuenta</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};
