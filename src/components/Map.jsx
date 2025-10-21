'use client';

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [30, 52],
    iconAnchor: [15, 52],
});

const Map = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const indiaCenter = [20.5937, 78.9629]; // Coordinates for India
    const bangalorePosition = [13.047, 77.621]; // Coordinates for Manyata Tech Park, Bangalore

    return (
        <>
            {isClient && (
                <MapContainer center={indiaCenter} zoom={4} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 10 }}>
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="OpenStreetMap">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satellite View">
                            <TileLayer
                                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <Marker position={bangalorePosition}>
                        <Popup>
                            Manyata Tech Park, Bangalore
                        </Popup>
                    </Marker>
                </MapContainer>
            )}
        </>
    );
};

export default Map;