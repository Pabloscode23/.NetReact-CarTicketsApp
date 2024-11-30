import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import '../styles/UploadImagePage.css';
import { API_URL } from '../../../constants/Api';
import { useAuth } from '../../../hooks';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet styles are included
import '@fortawesome/fontawesome-free/css/all.min.css';

const UploadImagePage = () => {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const mapRef = useRef(null); // Reference for the map container
    const mapInstance = useRef(null); // Reference for the map instance
    const currentMarker = useRef(null); // Reference for the current marker
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    useEffect(() => {
        // Initialize the map only when an image is uploaded
        if (image && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                attributionControl: false, // Disable the attribution control
            }).setView([9.7489, -83.7534], 7);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © OpenStreetMap contributors',
            }).addTo(mapInstance.current);

            // Add a click event listener to the map
            mapInstance.current.on('click', (event) => {
                const { lat, lng } = event.latlng;
                setCoordinates({ latitude: lat, longitude: lng });

                // If there is already a marker, remove it
                if (currentMarker.current) {
                    mapInstance.current.removeLayer(currentMarker.current);
                }

                // Create a Font Awesome icon for the marker
                const arrowIcon = L.divIcon({
                    html: '<i class="fas fa-location-dot fa-2x" style="color: red;"></i>',
                    className: 'custom-div-icon', // Optional custom class for styling
                    iconSize: [32, 32], // Size of the icon
                    iconAnchor: [16, 16], // Position of the anchor
                });

                // Add the new marker and store the reference
                const marker = L.marker([lat, lng], { icon: arrowIcon }).addTo(mapInstance.current);
                currentMarker.current = marker; // Store the reference to the current marker
            });
        }

        return () => {
            // Clean up the map instance to avoid conflicts
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [image]); // This will run only when `image` changes

    const createAutomaticTicket = async (detectedPlate) => {
        if (!detectedPlate) {
            showErrorAlert('El número de placa no fue detectado. Por favor intente de nuevo.');
            return;
        }

        if (!coordinates.latitude || !coordinates.longitude) {
            showErrorAlert('Por favor seleccione una ubicación en el mapa.');
            return;
        }

        try {
            const ticketData = {
                id: `ticket-${Date.now()}`, // Unique ID generated automatically
                userId: "123456789", // User ID
                date: new Date().toISOString(), // Current date
                latitude: coordinates.latitude, // Selected coordinates
                longitude: coordinates.longitude, // Selected coordinates
                description: "Exceso de velocidad", // Reason for the fine
                status: "Pendiente", // Initial status
                officerId: user.idNumber, // Officer ID
                amount: 68000, // Fixed fine amount
                plate: detectedPlate, // Detected license plate number
            };

            console.log('Datos del ticket enviados:', ticketData); // Debugging log

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
            showErrorAlert('Por favor suba una imagen.');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);

        setLoading(true);
        setMessage('');

        try {
            // Call the backend to detect the plate
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Respuesta del backend:', response.data); // Debugging log

            const detectedText = response.data.text; // Ensure the backend returns the correct key
            setPlateNumber(detectedText);

            // Automatically create the ticket with the detected plate
            await createAutomaticTicket(detectedText);
        } catch (error) {
            console.error('Error al detectar la placa:', error.response?.data || error.message);
            setMessage('Error al detectar la placa, intente de nuevo por favor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-image">
            <h1 className="upload-image__title">Cargar imagen para detectar placa<br /> y crear multa</h1>
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
                {image && (
                    <div className="upload-image__map-container">
                        <h2>Seleccione una ubicación en el mapa</h2>
                        <div
                            id="map"
                            ref={mapRef}
                            style={{ height: '400px', width: '100%', margin: '10px 0' }}
                        />
                    </div>
                )}
                <div className="upload-image__actions">
                    <button className="upload-image__button" type="submit" disabled={loading}>
                        {loading ? 'Procesando...' : 'Crear multa'}
                    </button>
                </div>
                {message && <p className="upload-image__message">{message}</p>}
                {plateNumber && <p className="upload-image__plate">Número de placa detectado: {plateNumber}</p>}
                {coordinates.latitude && coordinates.longitude && (
                    <p className="upload-image__coords">
                        Coordenadas seleccionadas: {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
                    </p>
                )}
            </form>
        </div>
    );
};

export default UploadImagePage;
