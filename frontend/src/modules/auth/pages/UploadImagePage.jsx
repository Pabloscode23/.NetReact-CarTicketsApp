import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UploadImagePage.css';

const UploadImagePage = () => {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
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
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const detectedText = response.data.text;
            setPlateNumber(detectedText);
            setMessage('Placa detectada correctamente.');
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage('Error al detectar la placa, intente de nuevo por favor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-image">
            <h1 className="upload-image__title">Cargar imagen para generar multa</h1>
            <form className="upload-image__form" onSubmit={handleSubmit}>
                <div className="upload-image__field">
                    <label className="upload-image__label">Subir Imagen</label>
                    <input
                        className="upload-image__input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="upload-image__actions">
                    <button className="upload-image__button" type="submit">
                        {loading ? 'Processing...' : 'Enviar Imagen'}
                    </button>
                </div>
                {message && <p className="upload-image__message">{message}</p>}
                {plateNumber && <p className="upload-image__plate">Número de placa detectado: {plateNumber}</p>}
            </form>
        </div>
    );
};

export default UploadImagePage;
