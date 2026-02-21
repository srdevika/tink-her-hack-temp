import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to re-center map when location changes
function RecenterMap({ location }) {
    const map = useMap();
    map.setView([location.lat, location.lng], map.getZoom());
    return null;
}

export default function MapView({ location }) {
    if (!location) return null;

    return (
        <div className="map-container">
            <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]}>
                    <Popup>
                        📍 Emergency Location<br />
                        Lat: {location.lat.toFixed(5)}<br />
                        Lng: {location.lng.toFixed(5)}
                    </Popup>
                </Marker>
                <RecenterMap location={location} />
            </MapContainer>
        </div>
    );
}
