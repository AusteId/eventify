import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { FaMapMarkerAlt, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { convertToCompactEuDatetime } from '../../utils/dateFunctions';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const defaultIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const EventPopup = ({ events }) => {
  const { isDarkMode } = useDarkMode();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const currentEvent = events[currentEventIndex];

  const handlePrevEvent = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-dark-gray text-light' : 'bg-light-gray text-medium'} max-w-[15rem]`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-body-m text-center flex-1">{truncateText(currentEvent.name, 21)}</h3>
        {events.length > 1 && (
          <span className="bg-btn/20 text-btn text-xs px-1.5 py-0.5 rounded-full ml-5"
            style={{ marginRight: '10px' }}
          >
            {`${currentEventIndex + 1} of ${events.length}`}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0 custom-popup-content">
        <div className="flex items-center gap-2 pt-4 pb-1">
          <FaMapMarkerAlt className="text-btn" />
          <p className="m-0">{`${currentEvent.address}, ${currentEvent.city}`}</p>
        </div>
        <div className="flex items-center gap-2 pt-1 pb-3">
          <FaCalendarAlt className="text-btn" />
          <p className="m-0">{`${convertToCompactEuDatetime(currentEvent.startDateTime)}`}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        {events.length > 1 ? (
          <button
            onClick={handlePrevEvent}
            className="p-1 rounded-full hover:bg-btn/20 text-btn"
          >
            <FaChevronLeft />
          </button>
        ) : (
          <div className="w-6 h-6" />
        )}

        <Link
          to={`/events/${currentEvent.id}`}
          className="text-body-s font-semibold hover:bg-btn/8 p-3 rounded-lg"
          style={{ color: 'var(--color-btn)' }}
        >
          View Event
        </Link>
        {events.length > 1 ? (
          <button
            onClick={handleNextEvent}
            className="p-1 rounded-full hover:bg-btn/20 text-btn"
          >
            <FaChevronRight />
          </button>
        ) : (
          <div className="w-6 h-6" />
        )}
      </div>
    </div>
  );
};

const EventMap = ({ events, eventId }) => {
  const { isDarkMode } = useDarkMode();

  const mapRef = useRef();

  const MapController = ({ eventId, events }) => {
    const map = useMap();

    useEffect(() => {
      if (!eventId || !events) return;

      const selectedEvent = events.find(
        event => String(event.id) === String(eventId),
      );
      if (
        !selectedEvent ||
        !selectedEvent.latitude ||
        !selectedEvent.longitude
      ) {
        map.setView([54.6892, 25.2798], 13);
        return;
      }

      const { latitude, longitude } = selectedEvent;
      map.setView([latitude, longitude], 13);

      const markerLayer = map._layers;
      Object.values(markerLayer).forEach(layer => {
        if (
          layer instanceof L.Marker &&
          layer.getLatLng().lat === latitude &&
          layer.getLatLng().lng === longitude
        ) {
          layer.openPopup();
        }
      });
    }, [eventId, events, map]);

    return null;
  };

  const groupEventsByCoordinates = (events) => {
    const grouped = {};

    events
      .filter(event => event.latitude != null && event.longitude != null)
      .forEach(event => {
        const key = `${event.latitude},${event.longitude}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(event);
      });

    return Object.entries(grouped).map(([key, eventGroup]) => {
      const [latitude, longitude] = key.split(',').map(Number);
      return { latitude, longitude, events: eventGroup };
    });
  };

  const groupedEvents = groupEventsByCoordinates(events);

  return (
    <MapContainer
      center={[54.6892, 25.2798]}
      zoom={13}
      className={`w-full desktop:w-[69.5rem] mx-auto rounded-[0.5rem] z-10 ${isDarkMode ? 'dark-mode' : ''}`}
      style={{
        height: 'calc(100vh - 18.75rem)',
        minHeight: '25rem',
        minWidth: '22rem',
      }}
      ref={mapRef}
    >
      <TileLayer
        url={
          isDarkMode
            ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }
        attribution={
          isDarkMode
            ? '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      />
      <MapController eventId={eventId} events={events} />
      {groupedEvents.map((group, index) => (
        <Marker
          key={index}
          position={[group.latitude, group.longitude]}
          icon={defaultIcon}
        >

          <Popup>
            <EventPopup events={group.events} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EventMap;
