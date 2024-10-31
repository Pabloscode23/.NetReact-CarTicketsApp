import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // Import the reCAPTCHA component
import '../../../../src/modules/auth/styles/TwoFactorPage.css';

export const PublicResquestPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            number: "",
        },
    });

    const navigate = useNavigate();
    const [captchaToken, setCaptchaToken] = useState(null);
    const [captchaError, setCaptchaError] = useState(null);

    // Function to handle reCAPTCHA
    const onCaptchaChange = (token) => {
        setCaptchaToken(token);
        setCaptchaError(null); // Clear any previous captcha errors
    };

    const onSubmit = handleSubmit((data) => {
        if (!captchaToken) {
            setCaptchaError("Por favor verifique que no es un robot.");
            return;
        }

        console.log(data);
        reset();
        navigate('/', { replace: true });

        // Optional: Send the captcha token to your backend for verification
        // axios.post('/verify-captcha', { token: captchaToken });
    });

    return (
        <div className="two-factor-request">
            <h1 className="two-factor__title title-request">Consulta pública de multas</h1>
            <form className="two-factor__form" onSubmit={onSubmit}>
                <div className="two-factor__inputs">
                    <div className="login-form__field">
                        <label className="login-form__label">Ingrese su número de placa</label>
                        <input
                            className="login-form__input"
                            type="text"
                            name="number"
                            {...register("number", {
                                required: "Número de placa es requerido",
                                pattern: {
                                    value: /^[a-zA-Z0-9-]+$/,
                                    message: "Verifique que el número de placa sea válido",
                                },
                            })}
                        />
                        {errors.number && (
                            <span className="login-form__error">{errors.number.message}</span>
                        )}
                    </div>
                </div>

                {/* reCAPTCHA Section */}
                <label className="login-form__label">Verificación CAPTCHA</label>
                <ReCAPTCHA
                    sitekey="6LdSQmgqAAAAAKxwVm9RCC-b0MtyxmucFimK57UE" // key de google captcha
                    onChange={onCaptchaChange}
                />
                {captchaError && (
                    <span className="login-form__error">{captchaError}</span>
                )}

                <div className="two-factor__actions">
                    <button className="two-factor__button" type="submit">Consultar</button>
                </div>
            </form>
        </div>
    );
};
