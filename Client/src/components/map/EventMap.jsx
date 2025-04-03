import { MapContainer, TileLayer } from 'react-leaflet';

const EventMap = () => {
    return (
        <MapContainer
            center={[54.6892, 25.2798]}
            zoom={13}
            className="w-full desktop:w-[69.5rem] mx-auto rounded-[0.5rem]"
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
        </MapContainer>
    );
};

export default EventMap;