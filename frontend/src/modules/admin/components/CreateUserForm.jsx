import { useRef } from "react";
import { useForm } from "react-hook-form";
import '../styles/CreateUserForm.css';
import { API_URL } from "../../../constants/Api";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../constants/Swal/SwalFunctions";


const roles = [
    { value: "admin", label: "Administrador" },
    { value: "oficial", label: "Oficial" },
    { value: "juez", label: "Juez" },
];

export const CreateUserForm = ({ closeModal, refetch }) => {

    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        setError, reset
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            idNumber: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: roles[0].value,
        },
    });

    const password = useRef(null);
    password.current = watch("password", "");

    const onSubmit = async (data) => {
        console.log("Data:", data);


        // Create the user object based on the provided structure
        const userData = {
            userId: data.idNumber,
            name: data.firstName + " " + data.lastName, // Combining first and last name
            idNumber: data.idNumber,
            email: data.email,
            password: data.password,
            phoneNumber: data.phoneNumber,
            role: data.role,
            profilePicture: "", // You can set this to a default value or update it later
        };

        try {
            const existingUsersResponse = await axios.get(`${API_URL}/UserDTO`);
            const existingUsers = existingUsersResponse.data;

            const userExists = existingUsers.some(user => user.idNumber === data.idNumber);
            const emailExists = existingUsers.some(user => user.email === data.email);

            if (userExists) {
                // Si el usuario ya existe, establecer un error en el campo idNumber
                setError("idNumber", {
                    type: "manual",
                    message: "El número de cédula ya está registrado"
                });
                return;
            }

            if (emailExists) {
                // Si el correo ya existe, establecer un error en el campo email
                setError("email", {
                    type: "manual",
                    message: "El correo electrónico ya está registrado"
                });
                return;
            }
            const response = await axios.post(`${API_URL}/UserDTO`, userData); // Replace YOUR_API_ENDPOINT with your actual endpoint
            console.log("Usuario creado:", response.data);



            showSuccessAlert('Usuario creado exitosamente', 'El usuario ha sido registrado correctamente.');
            // Navigate to the users page
            reset();
            refetch();
            closeModal();
            // Handle successful response (e.g., show a success message, redirect, etc.)
        } catch (error) {
            console.error("Error al crear usuario:", error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="container__form-two">
            <h1>Crear usuario</h1>
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
                            pattern: { value: /^[a-zA-ZÀ-ÿ\s]+$/, message: "Nombre solo acepta letras" }
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
                            maxLength: { value: 30, message: "Apellidos tienen que ser menores a 30 caracteres" },
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

                <div className="form__button-wrapper">
                    <button className="form__button" type="submit">Crear usuario</button>
                </div>
            </form>
        </div>
    );
};