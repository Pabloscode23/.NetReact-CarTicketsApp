import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { API_URL } from '../../../constants/Api';

const HeatMap = () => {
    const mapContainerRef = useRef(null);
    const [heatData, setHeatData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [9.7489, -83.7534], // Coordenadas iniciales para Costa Rica
                zoom: 7,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/TicketDTO/heatmap`);
                const data = await response.json();

                if (data.length > 0) {
                    const locationMap = {};

                    data.forEach((point) => {
                        const { latitude, longitude } = point;
                        const key = `${latitude},${longitude}`;

                        if (locationMap[key]) {
                            locationMap[key].intensity += Math.pow(locationMap[key].intensity, 0.5) + 1; // Crecimiento no lineal
                        } else {
                            locationMap[key] = { latitude, longitude, intensity: 10 }; // Intensidad inicial alta
                        }
                    });

                    const formattedData = Object.values(locationMap).map((point) => [
                        point.latitude,
                        point.longitude,
                        point.intensity,
                    ]);
                    setHeatData(formattedData);
                } else {
                    setHeatData([]);
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
                setHeatData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (mapRef.current && heatData.length > 0) {
            const existingHeatLayer = Object.values(mapRef.current._layers).filter(
                (layer) => layer instanceof L.HeatLayer
            );
            if (existingHeatLayer.length > 0) {
                mapRef.current.removeLayer(existingHeatLayer[0]);
            }

            const heatLayer = L.heatLayer(heatData, {
                radius: 40, // Radio más grande para zonas con más datos
                blur: 15, // Más desenfoque para transiciones suaves
                maxZoom: 19,
                minOpacity: 0.6, // Zonas sin datos en verde
                gradient: {
                    0.1: '#001DC0',
                    0.2: '#002BFF',
                    0.3: '#0170FF',
                    0.4: '#21FED5',
                    0.5: '#71FD80',
                    0.6: '#FFDD00',
                    0.7: '#FFA000',
                    0.8: '#FF0101',
                },
            });

            heatLayer.addTo(mapRef.current);
        }
    }, [heatData]);

    return (
        <div>
            <div id="heatmap" ref={mapContainerRef} style={{ height: '500px', width: '100%' }}>
                {isLoading ? (
                    <h2>Cargando el mapa...</h2>
                ) : heatData.length === 0 ? (
                    <h2>No hay datos para mostrar en el mapa.</h2>
                ) : null}
            </div>
        </div>
    );
};

export default HeatMap;
