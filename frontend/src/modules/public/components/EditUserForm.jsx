import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../../../constants/Api';
import { useForm } from "react-hook-form";
import '../styles/FormRegistFinalUser.css'; // Asegúrate de que la ruta sea correcta
import { showSuccessAlert } from '../../../constants/Swal/SwalFunctions';

const EditUserForm = ({ user, onUserUpdated, onUpdate, closeModal }) => {
    const roles = [
        { value: "admin", label: "Administrador" },
        { value: "oficial", label: "Oficial" },
        { value: "juez", label: "Juez" },
        {
            value: "usuario", label: "Usuario final"
        }
    ];
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            firstName: user.name.split(" ").slice(0, -2).join(" "), // Obtener todos los nombres hasta los últimos dos apellidos
            lastName: user.name.split(" ").slice(-2).join(" "),
            idNumber: user.idNumber,
            phoneNumber: user.phoneNumber,
            email: user.email,
            password: user.password,
            confirmPassword: '',
            profilePicture: user.profilePicture,
            role: user.role,
        },
    });

    const apiCall = async (data) => {
        try {
            const response = await axios.put(`${API_URL}/UserDTO/${data.idNumber}`, data);
            console.log("Usuario actualizado:", response.data);
            onUpdate();

        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    }


    useEffect(() => {
        setValue("idNumber", user.idNumber);
        setValue("name", user.name);
        setValue("email", user.email);
    }, [user, setValue]);
    const password = useRef(null);
    password.current = watch("password", "");
    const onSubmit = async (data) => {
        try {
            // Preparar datos del formulario
            const formData = {
                userId: data.idNumber,
                name: `${data.firstName} ${data.lastName}`,
                idNumber: data.idNumber,
                email: data.email,
                password: data.password,
                phoneNumber: data.phoneNumber,
                role: data.role,
                profilePicture: data.profilePicture,
            };

            apiCall(formData);
            console.log("Funciona");


            showSuccessAlert("Usuario actualizado existosamente");
            closeModal();

            reset();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    return (
        <div className="container__form">
            <h1>Editar Usuario</h1>
            <br />
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form__group">
                    <label className="form__label">Nombre:</label>
                    <input
                        className="form__input"
                        type="text"
                        {...register("firstName", {
                            required: "Nombre es requerido",
                            maxLength: { value: 30, message: "Nombre tiene que ser menor a 30 caracteres" },
                            minLength: { value: 2, message: "Nombre tiene que tener al menos 2 caracteres" },
                            pattern: { value: /^[a-zA-ZÀ-ÿ\s]+$/, message: "Nombre solo acepta letras y tildes" }
                        })}
                    />
                    {errors.firstName && <span className="form__error">{errors.firstName.message}</span>}
                </div>

                <div className="form__group">
                    <label className="form__label">Apellidos:</label>
                    <input
                        className="form__input"
                        type="text"
                        {...register("lastName", {
                            required: "Apellidos son requeridos",
                            maxLength: { value: 50, message: "Apellidos tienen que ser menores a 50 caracteres" },
                            minLength: { value: 2, message: "Apellidos tienen que ser al menos 2 caracteres" },
                            pattern: {
                                value: /^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)$/,
                                message: "Apellidos deben ser de dos palabras y solo letras"
                            }
                        })}
                    />
                    {errors.lastName && <span className="form__error">{errors.lastName.message}</span>}
                </div>

                <div className="form__group">
                    <label className="form__label">Número de cédula:</label>
                    <input
                        className="form__input"
                        type="text"
                        {...register("idNumber", {
                            required: "Número de cédula es requerido",
                            pattern: { value: /^[0-9]{9}$/, message: "Número de cédula debe ser solo numérico y de 9 caracteres" }
                        })}

                    />
                    {errors.idNumber && <span className="form__error">{errors.idNumber.message}</span>}
                </div>

                <div className="form__group">
                    <label className="form__label">Número de teléfono:</label>
                    <input
                        className="form__input"
                        type="tel"
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
                        {...register("confirmPassword", {
                            required: "Confirmación de contraseña es requerida",
                            validate: (value) => value === password.current || "Contraseñas no coinciden"
                        })}
                    />
                    {errors.confirmPassword && <span className="form__error">{errors.confirmPassword.message}</span>}
                </div>


                <div className='form__group full-width'>
                    <label className="form__label">Rol:</label>
                    <select className='form__input' {...register("role")}>
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                    </select>
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
                    <button className="form__button" type="submit">Actualizar datos</button>
                </div>
            </form>
        </div>
    );
};

EditUserForm.propTypes = {
    user: PropTypes.object.isRequired,
    onUserUpdated: PropTypes.func.isRequired,
};

export default EditUserForm;
