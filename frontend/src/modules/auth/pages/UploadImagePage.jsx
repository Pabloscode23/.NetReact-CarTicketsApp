import { useForm } from "react-hook-form";
import { useState } from "react";
import '../styles/UploadImagePage.css';

export const UploadImagePage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [message, setMessage] = useState('');
    const [plateNumber, setPlateNumber] = useState(''); // Estado para mostrar el número de placa

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('image', data.image[0]);

        try {
            // Enviar la imagen al backend para que la procese
            const response = await fetch('http://localhost:5039/api/multas/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error("Error al procesar la imagen.");
            }

            const result = await response.json();
            setMessage(result.message);  // Mostrar mensaje de éxito o error
            setPlateNumber(result.plateNumber);  // Mostrar el número de placa detectado
            reset();  // Limpiar el formulario
        } catch (error) {
            setMessage("Ocurrió un error al procesar la imagen.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="upload-image">
            <h1 className="upload-image__title">Cargar Imagen para Generar Multa</h1>
            <form className="upload-image__form" onSubmit={handleSubmit(onSubmit)}>
                <div className="upload-image__field">
                    <label className="upload-image__label">Subir Imagen</label>
                    <input
                        className="upload-image__input"
                        type="file"
                        accept="image/*"
                        {...register("image", { required: "La imagen es requerida" })}
                    />
                    {errors.image && <span className="upload-image__error">{errors.image.message}</span>}
                </div>
                <div className="upload-image__actions">
                    <button className="upload-image__button" type="submit">Enviar Imagen</button>
                </div>
                {message && <p className="upload-image__message">{message}</p>} {/* Mensaje de respuesta */}
                {plateNumber && <p className="upload-image__plate">Número de placa detectado: {plateNumber}</p>} {/* Mostrar número de placa */}
            </form>
        </div>
    );
};
