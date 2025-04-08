import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { convertToCompactEuDatetime } from '../../utils/dateFunctions';

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
                            <div className="p-3 rounded-lg bg-light-gray text-medium max-w-[15rem]">

                                <h3 className="font-bold text-body-m mb-2 text-center">{event.name}</h3>

                                <div className="flex flex-col gap-0 custom-popup-content">
                                    <div className="flex items-center gap-2 pt-4 pb-1">
                                        <FaMapMarkerAlt className="text-btn" />
                                        <p className="m-0">{`${event.address}, ${event.city}`}</p>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1 pb-3">
                                        <FaCalendarAlt className="text-btn" />
                                        <p className="m-0">{`${convertToCompactEuDatetime(event.startDateTime)}`}</p>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="text-body-s font-semibold hover:bg-btn/8 p-3 rounded-lg"
                                        style={{ color: 'var(--color-btn)' }}
                                    >
                                        View Event
                                    </Link>
                                </div>

                            </div>
                        </Popup>


                    </Marker>
                ))}
        </MapContainer>
    );
};

export default EventMap;