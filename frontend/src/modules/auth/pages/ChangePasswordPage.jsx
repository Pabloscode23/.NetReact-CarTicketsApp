import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import '../styles/ChangePasswordPage.css';
import { API_URL } from "../../../constants/Api";
import axios from "axios";
//



const validateToken = async (code) => {
    try {
        const res = await axios.post(`${API_URL}/Auth/ValidateCodePassRecover`, { code });

        if (res.status === 200) {
            return true;
        }
    } catch (error) {
        alert("El token es inválido o ha expirado.");
        console.log(error);
        return false;
    }
};

export const ChangePasswordPage = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });
    const [searchParams] = useSearchParams();
    const token = searchParams.get("t"); // Obtener el token del parámetro de la URL
    const navigate = useNavigate();

    useEffect(() => {

        if (!token) {
            navigate('/login');
        }

        const isValid = validateToken(token);

        if (!isValid) {
            return <>
                <h1>Token inválido</h1>
                <p>El token es inválido o ha expirado.</p>
                <Link to="/login"><button className="change-password__button">Volver al login</button></Link>
            </>
        }
    }, [token, navigate]);

    const onSubmit = handleSubmit(async (data) => {

        if (data.confirmPassword !== data.password) {
            return alert("Las contraseñas no coinciden");
        }

        const changePasswordObject = {
            newPassword: data.password
        };

        try {
            const res = await axios.post(`${API_URL}/UserDTO/ChangePassword/${token}`, changePasswordObject);
            if (res.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);

            alert("Ha ocurrido un error al cambiar la contraseña. Por favor, inténtelo de nuevo.");
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
