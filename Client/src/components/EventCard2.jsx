import axios from 'axios';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  convertToCompactEuDatetime,
  formatToOnlyTime,
} from '../utils/dateFunctions';
import Button from './Button';

const EventCard2 = props => {
  const event = props.event;
  const [imageData, setImageData] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      if (!event.id) {
        setImageData('./src/assets/eventCardImgSample.png');
        setIsImageLoading(false);
        return;
      }
      try {
        setIsImageLoading(true);
        const url = `${import.meta.env.VITE_BACK_URL}/api/events/${event.id}/picture`;
        const response = await axios.get(url, {
          responseType: 'blob',
        });
        const image = URL.createObjectURL(response.data);
        setImageData(image);
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log(
          'Error details:',
          error.response?.data,
          error.response?.status,
        );
      } finally {
        setIsImageLoading(false);
      }
    };
    fetchImage();
  }, [event.id]);

  const timeString =
    event?.startDateTime && event?.endDateTime
      ? `${convertToCompactEuDatetime(event?.startDateTime)} - ${formatToOnlyTime(event?.endDateTime)}`
      : 'N/A';

  const ageString =
    event.eventminAge !== null && event.maxAge !== null
      ? `Min age: ${event.minAge} - max age: ${event.maxAge}`
      : event.minAge !== null
        ? `Min age: ${event.minAge}`
        : event.maxAge !== null
          ? `Max age: ${event.maxAge}`
          : 'All Welcome!';

  const expLevels = {
    'All Welcome': ['bg-welcome', 'All Welcome!'],
    Beginner: ['bg-beginner', 'Beginner Friendly'],
    Intermediate: ['bg-intermediate', 'Intermediate'],
    Advanced: ['bg-advanced', 'Advanced'],
    Extreme: ['bg-extreme', 'Extreme'],
  };

  const normalizedExpLevel = event?.experienceLevel
    ? event?.experienceLevel
    : 'All Welcome';

  return (
    <div className="card bg-base-100 w-100 h-113 my-10 shadow-md hover:shadow-xl transition-all ">
      <figure className="relative">
        <img
          src={imageData || './src/assets/eventCardImgSample.png'}
          alt="Image"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="flex gap-1 bg-black/50 rounded-full text-white py-[0.38rem] px-[0.75rem] text-sm z-10">
            <img src="./src/assets/threePersonIcon.svg" />
            {event?.currentParticipants || 0}/{event?.maxParticipants}
          </div>
        </div>
        {event.experienceLevel !== 0 && (
          <div
            className={`absolute right-3 top-3 ${expLevels[normalizedExpLevel][0] ?? ''} rounded-full py-1.5 px-3 text-[0.875rem] z-10`}
          >
            <p className="text-white">{expLevels[normalizedExpLevel][1]}</p>
          </div>
        )}
      </figure>

      <div className="card-body p-4">
        <h3 className="card-title text-xl">{event?.name || 'Not available'}</h3>
        {event?.description ? (
          <p className="text-base-content/70 text-sm">{event.description}</p>
        ) : (
          <p className="text-base-content/70 text-sm italic">
            No description available
          </p>
        )}

        <div className="space-y-3 my-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-base-content/70" />
            <span>{timeString}</span>
          </div>
          {/* <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-base-content/70" />
            <span>{'6:00'}</span>
          </div> */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-base-content/70" />
            <span>{event?.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-base-content/70" />
            <span>{ageString}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-2">
          <Button isFull={true}>Register</Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard2;
