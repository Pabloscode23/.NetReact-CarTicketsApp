import { useRef } from "react";
import { useForm } from "react-hook-form";
import '../styles/FormRegistFinalUser.css';

export const FormRegistFinalUser = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            idNumber: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            profilePicture: "",
        },
    });

    const password = useRef(null);
    password.current = watch("password", "");

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        reset();
    });

    return (
        <div className="container__form"><h1>Registrarse</h1>
            <form className="form" onSubmit={onSubmit}>
                <div className="form__group">
                    <label className="form__label">Nombre:</label>
                    <input
                        className="form__input"
                        type="text"
                        name="firstName"
                        {...register("firstName", {
                            required: "Nombre es requerido",
                            maxLength: { value: 30, message: "Nombre tiene que ser menor a 30 caracteres" },
                            minLength: { value: 2, message: "Nombre tiene que tener al menos 2 caracteres" },
                            pattern: { value: /^[a-zA-Z\s]+$/, message: "Nombre solo acepta letras" }
                        })}
                    />
                    {errors.firstName && <span className="form__error">{errors.firstName.message}</span>}
                </div>

                <div className="form__group">
                    <label className="form__label">Apellidos:</label>
                    <input
                        className="form__input"
                        type="text"
                        name="lastName"
                        {...register("lastName", {
                            required: "Apellidos son requeridos",
                            maxLength: { value: 50, message: "Apellidos tienen que ser menores a 30 caracteres" },
                            minLength: {
                                value: 2, message: "Apellidos tienen que ser al menos 2 caracteres"
                            }, pattern: { value: /^[a-zA-Z\s]+$/, message: "Apellidos solo aceptan letras" }
                        })}
                    />
                    {errors.lastName && <span className="form__error">{errors.lastName.message}</span>}
                </div>

                <div className="form__group">
                    <label className="form__label">Número de cédula:</label>
                    <input
                        className="form__input"
                        type="text"
                        name="idNumber"
                        {...register("idNumber", {
                            required: "Número de cédula es requerido",
                            pattern: { value: /^[0-9]+$/, message: "Número de cédula debe ser solo numérico" }
                        })}
                    />
                    {errors.idNumber && <span className="form__error">{errors.idNumber.message}</span>}
                </div>

                <div className="form__group">
                    <label className="form__label">Número de teléfono:</label>
                    <input
                        className="form__input"
                        type="tel"
                        name="phoneNumber"
                        {...register("phoneNumber", {
                            required: "Número de teléfono es requerido",
                            pattern: { value: /^[0-9]{8}$/, message: "Número de teléfono debe ser de 8 dígitos" }
                        })}
                    />
                    {errors.phoneNumber && <span className="form__error">{errors.phoneNumber.message}</span>}
                </div>

                <div className="form__group">
                    <label className="form__label">Correo electrónico:</label>
                    <input
                        className="form__input"
                        type="email"
                        name="email"
                        {...register("email", {
                            required: "Correo electrónico es requerido",
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                message: "Verifique el formato de su correo electrónico"
                            }
                        })}
                    />
                    {errors.email && <span className="form__error">{errors.email.message}</span>}
                </div>

                <div className="form__group">
                    <label className="form__label">Contraseña:</label>
                    <input
                        className="form__input"
                        type="password"
                        name="password"
                        {...register("password", {
                            required: "Contraseña es requerida",
                            minLength: { value: 8, message: "Contraseña debe tener al menos 8 caracteres" },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: "Contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número"
                            }
                        })}
                    />
                    {errors.password && <span className="form__error">{errors.password.message}</span>}
                </div>


                <div className="form__group">
                    <label className="form__label">Confirmación de contraseña:</label>
                    <input
                        className="form__input"
                        type="password"
                        name="confirmPassword"
                        {...register("confirmPassword", {
                            required: "Confirmación de contraseña es requerida",
                            validate: (value) => value === password.current || "Contraseñas no coinciden"
                        })}
                    />
                    {errors.confirmPassword && <span className="form__error">{errors.confirmPassword.message}</span>}
                </div>

                <div className="form__group">
                    <label className="form__label">Imagen de perfil:</label>
                    <input
                        className="form__input"
                        type="file"
                        onChange={(e) => {
                            setValue("profilePicture", e.target.files[0].name);
                        }}
                    />
                    {errors.profilePicture && <span className="form__error">{errors.profilePicture.message}</span>}
                </div>

                <div className="form__button-wrapper">
                    <button className="form__button" type="submit">Registrarme</button>
                </div>
            </form></div>
    );
};
