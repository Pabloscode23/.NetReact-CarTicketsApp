import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import '../styles/ChangePasswordPage.css';
//
export const ChangePasswordPage = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });
    const [searchParams] = useSearchParams();
    const token = searchParams.get("t"); // Obtener el token del parámetro de la URL
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica si el token existe
        if (!token) {
            // navigate('/login'); // Redirige si no hay token
        }
    }, [token, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            console.log("Cambiar contraseña a:", data.password);
            reset();
            navigate('/login'); // Redirige al login tras el cambio exitoso
        } catch (error) {
            alert("Ocurrió un error al cambiar la contraseña.");
            navigate('/login'); // Redirige al login si hay un error
        }
    });

    return (
        <div className="change-password">
            <h1 className="change-password__title">Cambiar contraseña</h1>
            <form className="change-password__form" onSubmit={onSubmit}>
                <div className="change-password__inputs">
                    <div className="change-password__field">
                        <label className="change-password__label">Nueva contraseña</label>
                        <input
                            className="change-password__input"
                            type="password"
                            {...register("password", {
                                required: "La contraseña es requerida",
                                minLength: {
                                    value: 8,
                                    message: "La contraseña debe tener al menos 8 caracteres"
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                    message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número"
                                }
                            })}
                        />
                        {errors.password && <span className="change-password__error">{errors.password.message}</span>}
                    </div>
                    <div className="change-password__field">
                        <label className="change-password__label">Confirmar contraseña</label>
                        <input
                            className="change-password__input"
                            type="password"
                            {...register("confirmPassword", {
                                required: "Por favor confirme su contraseña",
                                validate: (value) => {
                                    const password = watch('password');
                                    return value === password || "Las contraseñas no coinciden";
                                }
                            })}
                        />
                        {errors.confirmPassword && <span className="change-password__error">{errors.confirmPassword.message}</span>}
                    </div>
                </div>
                <div className="change-password__actions">
                    <button className="change-password__button" type="submit">Cambiar contraseña</button>
                </div>
            </form>
        </div>
    );
};
