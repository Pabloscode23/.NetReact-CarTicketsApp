import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UploadImagePage.css';
import { API_URL } from '../../../constants/Api';
import { useAuth } from '../../../hooks';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import { useNavigate } from 'react-router-dom';
import { TicketsInfo } from '../../../constants/TicketsInfo';

const UploadImagePage = () => {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const createAutomaticTicket = async () => {

        const ticketData = {
            id: `ticket-${Date.now()}`, // ID único generado automáticamente
            userId: "123456789", // ID del usuario (fijo en este caso)
            date: new Date().toISOString(), // Fecha actual
            latitude: 1, // Coordenadas ficticias
            longitude: 1, // Coordenadas ficticias
            description: "Exceso de velocidad", // Motivo de la multa
            status: "Pendiente", // Estado inicial
            officerId: user.idNumber, // ID del oficial (fijo en este caso)
            amount: 68000, // Monto fijo de la multa
        };

        try {
            const response = await axios.post(`${API_URL}/TicketDTO`, ticketData, {
                headers: { 'Content-Type': 'application/json' },
            });
            showSuccessAlert('Multa creada automáticamente por exceso de velocidad.');
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 5000);
            console.log('Multa creada:', response.data);
        } catch (error) {
            console.error('Error al crear la multa:', error.response?.data || error.message);
            showErrorAlert('Error al crear la multa automáticamente.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!image) {
            setMessage('Por favor suba una imagen.');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);

        setLoading(true);
        setMessage('');

        try {
            // Llamada al backend para detectar la placa
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const detectedText = response.data.text; // Asume que devuelve `{ text: "ABC123" }`
            setPlateNumber(detectedText);
            setMessage('Placa detectada correctamente.');

            // Crear automáticamente la multa (independientemente de la placa)
            await createAutomaticTicket();
        } catch (error) {
            console.error('Error al detectar la placa:', error.response?.data || error.message);
            setMessage('Error al detectar la placa, intente de nuevo por favor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-image">
            <h1 className="upload-image__title">Cargar imagen para detectar placa y crear multa</h1>
            <form className="upload-image__form" onSubmit={handleSubmit}>
                <div className="upload-image__field">
                    <label className="upload-image__label">Subir imagen</label>
                    <input
                        className="upload-image__input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="upload-image__actions">
                    <button className="upload-image__button" type="submit" disabled={loading}>
                        {loading ? 'Procesando...' : 'Enviar imagen'}
                    </button>
                </div>
                {message && <p className="upload-image__message">{message}</p>}
                {plateNumber && <p className="upload-image__plate">Número de placa detectado: {plateNumber}</p>}
            </form>
        </div>
    );
};

export default UploadImagePage;
