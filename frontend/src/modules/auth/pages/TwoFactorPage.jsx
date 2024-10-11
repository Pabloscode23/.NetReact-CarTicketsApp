import { useForm } from "react-hook-form";
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

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        reset();
    });

    return (
        <div className="login-form">
            <h1>Confirmación de código</h1>
            <form className="login-form__body" onSubmit={onSubmit}>
                <div className="login-form-inputs">
                    <div className="login-form__field">
                        <label className="login-form__label">Código de verificación</label>
                        <input
                            className="login-form__input"
                            type="text"
                            name="code"
                            {...register("code", {
                                required: "Código es requerido",
                                pattern: { value: /^[a-zA-Z0-9]*$/, message: "Código solo acepta letras y números" }
                            })}
                        />
                        {errors.code && (
                            <span className="login-form__error">{errors.code.message}</span>
                        )}
                    </div>
                </div>
                <div className="login-form__actions">
                    <button className="login-form__button" type="submit">Verificar</button>
                </div>

            </form>
        </div>
    );
};
