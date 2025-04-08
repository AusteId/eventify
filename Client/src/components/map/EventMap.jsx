import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const defaultIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const EventMap = ({ events }) => {
    return (
        <MapContainer
            center={[54.6892, 25.2798]}
            zoom={13}
            className="w-full desktop:w-[69.5rem] mx-auto rounded-[0.5rem] z-10"
            style={{
                height: 'calc(100vh - 18.75rem)',
                minHeight: '25rem',
                minWidth: '22rem',
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {events
                .filter(event => event.latitude != null && event.longitude != null)
                .map((event, index) => (
                    <Marker
                        key={index}
                        position={[event.latitude, event.longitude]}
                        icon={defaultIcon}
                    >
      <Popup>
        {event.name} <br />
        {event.description}
      </Popup>


                    </Marker>
                ))}
        </MapContainer>
    );
};

export default EventMap;