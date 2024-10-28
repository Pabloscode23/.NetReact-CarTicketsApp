import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import '../styles/TwoFactorPage.css';
import { useAuth } from "../../../hooks";
import { useNavigate } from "react-router-dom";

export const TwoFactorPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: { code: "" } });
    const { setToken, setUser } = useAuth();
    const navigate = useNavigate();
    const email = "kcordero0511@gmail.com"; // Reemplazar esto con el email dinámico del usuario
    const [generatedCode, setGeneratedCode] = useState(""); // Almacenar el código generado

    // Enviar el código de 2FA al correo cuando se cargue la página
    useEffect(() => {
        const sendTwoFactorCode = async () => {
            const code = generateTwoFactorCode(); // Generar el código 2FA
            setGeneratedCode(code); // Almacenar el código generado

            try {
                const response = await fetch("http://localhost:5039/api/notification/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: `Este es tu código de verificación: ${code}`, // Mensaje del correo
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
    }, [email]);

    const generateTwoFactorCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generar un código de 6 dígitos
    };

    const onSubmit = handleSubmit((data) => {
        console.log("Código ingresado:", data.code);
        if (data.code === generatedCode) { // Validar el código ingresado
            reset();
            setToken("token de prueba");
            setUser({ name: "Usuario", role: { name: "admin", permissions: ["Ver multas", "Ver reclamos", "Ver perfil"] } });
            navigate("/", { replace: true });
        } else {
            console.error("Código incorrecto");
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
                            name="code"
                            {...register("code", {
                                required: "Código es requerido",
                                pattern: { value: /^[a-zA-Z0-9]*$/, message: "Código solo acepta letras y números" },
                                minLength: { value: 6, message: "El código debe tener al menos 6 caracteres" },
                            })}
                        />
                        {errors.code && <span className="two-factor__error">{errors.code.message}</span>}
                    </div>
                </div>
                <div className="two-factor__actions">
                    <button className="two-factor__button" type="submit">Verificar</button>
                </div>
            </form>
        </div>
    );
};
