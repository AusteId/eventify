'use client';

import { useEffect, useState } from 'react';
import Button from './Button';
import ButtonCancel from './ButtonCancel';
import {
  convertToCompactEuDatetime,
  formatToOnlyTime,
} from '../utils/dateFunctions';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { IoPersonAdd } from 'react-icons/io5';
import joinEvent from '../helpers/event/joinEvent';
import cancelEvent from '../helpers/event/cancelEvent';
import { useAuth } from './Auth/AuthContext';
import toast from 'react-hot-toast';
import { Clock, MapPin, Users, Timer } from 'lucide-react';
import {
  differenceInDays,
  differenceInMinutes,
  formatDistance,
  formatDuration,
} from 'date-fns';

const EventCard = ({
  id,
  experienceLevel = 'All Welcome',
  isRegistered = 0,
  eventHandler,
  currentParticipants = 0,
  maxParticipants = 1,
  name = 'Title missing...',
  description,
  startDateTime,
  endDateTime,
  city = 'Location not provided',
  isEnded,
  minAge,
  maxAge,
}) => {
  const navigate = useNavigate();
  const normalizedExpLevel = experienceLevel ? experienceLevel : 'All Welcome';
  const [imageData, setImageData] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem(`event_${id}_participants`);
    return saved !== null ? parseInt(saved, 10) : currentParticipants;
  });
  const [loading, setLoading] = useState(false);
  const {
    isAuthenticated,
    loading: authLoading,
    birthDate,
  } = useAuth() || {
    isAuthenticated: false,
    loading: false,
    birthDate: null,
  };
  const [registered, setRegistered] = useState(() => {
    const saved = localStorage.getItem(`event_${id}_registered`);
    return saved !== null ? parseInt(saved, 10) : isRegistered;
  });

  useEffect(() => {
    const fetchImage = async () => {
      if (!id) {
        setImageData('./src/assets/eventCardImgSample.png');
        setIsImageLoading(false);
        return;
      }
      try {
        setIsImageLoading(true);
        const url = `${import.meta.env.VITE_BACK_URL}/api/events/${id}/picture`;
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
        setImageData(null);
      } finally {
        setIsImageLoading(false);
      }
    };
    fetchImage();
  }, [id]);

  const calculateAge = birthDate => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isAgeValid = () => {
    const userAge = calculateAge(birthDate);

    if (!userAge && !minAge && !maxAge) return true;
    if (!userAge) return false;

    if (minAge && userAge < minAge) return false;
    if (maxAge && userAge > maxAge) return false;
    return true;
  };

  const handleRegistration = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    if (isEnded || loading || authLoading) {
      return;
    }

    if (!isAgeValid()) {
      toast.error('Your age does not meet the requirements of the event.');
      return;
    }

    setLoading(true);
    try {
      if (registered) {
        await cancelEvent(id);
        setRegistered(0);
        setParticipants(prev => prev - 1);
        toast.success('Registration has been successfully canceled.');
      } else {
        if (participants < maxParticipants) {
          await joinEvent(id);
          setRegistered(1);
          setParticipants(prev => prev + 1);
          toast.success(`You're registered to ${name}!`);
        } else {
          toast.error('Places at the event have run out!');
        }
      }
      if (eventHandler) eventHandler();
    } catch (error) {
      const errorMessage = error.error || 'Something went wrong. Try it again.';
      toast.error(errorMessage);
      if (error.error) {
        const isUserRegistered = registered ? 0 : 1;
        setRegistered(isUserRegistered);
        setParticipants(prev => (isUserRegistered ? prev + 1 : prev - 1));
        localStorage.setItem(
          `event_${id}_registered`,
          isUserRegistered.toString(),
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const expLevels = {
    'All Welcome': ['bg-welcome', 'All Welcome!'],
    Beginner: ['bg-beginner', 'Beginner Friendly'],
    Intermediate: ['bg-intermediate', 'Intermediate'],
    Advanced: ['bg-advanced', 'Advanced'],
    Extreme: ['bg-extreme', 'Extreme'],
  };

  const wordArr = description?.split(' ');
  let shortDesc;
  if (wordArr?.length > 10) {
    const lastWord = wordArr[9];
    const cleanedLastWord =
      lastWord.endsWith('.') || lastWord.endsWith(',')
        ? lastWord.slice(0, -1)
        : lastWord;
    wordArr[9] = cleanedLastWord;
    shortDesc = wordArr?.slice(0, 10).join(' ') + '...';
  } else {
    shortDesc = wordArr?.join(' ') || 'Welcome to my event!';
  }

  const TimeString =
    startDateTime && endDateTime
      ? `${convertToCompactEuDatetime(startDateTime)}`
      : 'N/A';

  const DurationString =
    startDateTime && endDateTime
      ? `${formatDistance(new Date(endDateTime), new Date(startDateTime))}`
      : 'N/A';

  const ageString =
    minAge !== null && maxAge !== null
      ? `Min age: ${minAge} - Max age: ${maxAge}`
      : minAge !== null
        ? `Min age: ${minAge}`
        : maxAge !== null
          ? `Max age: ${maxAge}`
          : 'All Welcome!';

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-104 w-[22rem] desktop:max-w-[24.875rem]">
        <span className="loading loading-spinner loading-lg text-gray-500"></span>
      </div>
    );
  }

  // useEffect(() => {
  //   localStorage.setItem(`event_${id}_registered`, registered.toString());
  //   localStorage.setItem(`event_${id}_participants`, participants.toString());
  // }, [id, registered, participants]);

  return (
    <div
      className={`flex mt-0.5 mb-6 flex-col justify-between bg-white rounded-[0.5rem] h-104 desktop:h-108 w-[22rem] desktop:max-w-[24.875rem] shadow-[0_4px_6px_rgba(0,0,0,0.1),_0_2px_4px_rgba(0,0,0,0.1)] ${isEnded && 'grayscale-100'}`}
    >
      <div>
        <a
          onClick={() => navigate(`/events/${id}`)}
          className="cursor-pointer group"
        >
          <div className="relative">
            {participants !== null && (
              <div className="absolute flex top-2 left-2 bg-black/50 gap-1 rounded-full py-[0.38rem] px-[0.75rem] text-sm z-10">
                <img src="./src/assets/threePersonIcon.svg" />
                <p className="text-white">
                  {participants}/{maxParticipants}
                </p>
              </div>
            )}
            {experienceLevel !== 0 && (
              <div
                className={`absolute right-2 top-2 ${expLevels[normalizedExpLevel][0] ?? ''} rounded-full py-1.5 px-3 text-[0.875rem] z-10`}
              >
                <p className="text-white">{expLevels[normalizedExpLevel][1]}</p>
              </div>
            )}

            {isImageLoading ? (
              <div className="rounded-t-[0.5rem] h-44 w-full flex items-center justify-center bg-gray-200">
                <span className="loading loading-spinner loading-lg text-gray-500"></span>
              </div>
            ) : (
              <img
                src={imageData || './src/assets/eventCardImgSample.png'}
                alt="event photo"
                className="rounded-t-[0.5rem] h-44 w-full object-cover"
                onError={() => {
                  console.log('Image failed to load, using fallback');
                  setImageData('./src/assets/eventCardImgSample.png');
                }}
              />
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-[0.5rem]"></div>
          </div>
        </a>

        <div className="pt-5 px-5 flex flex-col gap-2">
          <h2 className="text-heading-xs font-[600] leading-[1.125rem] whitespace-nowrap overflow-hidden text-ellipsis">
            {name}
          </h2>
          <p className="h-12 font-inter text-body-medium text-body-m">
            {shortDesc}
          </p>
          <div className="flex flex-col gap-2 font-inter text-body-medium text-body-s">
            {startDateTime ? (
              <figure className="flex gap-2">
                <Clock size={20} />
                {endDateTime ? (
                  <div className="flex gap-2">
                    <figcaption>{TimeString}</figcaption>
                    <figcaption className="flex gap-1">
                      <Timer size={20} />
                      {DurationString}
                    </figcaption>
                  </div>
                ) : (
                  <figcaption>
                    {convertToCompactEuDatetime(startDateTime)}
                  </figcaption>
                )}
              </figure>
            ) : (
              <figure className="flex gap-2">
                <Clock size={20} />
                <figcaption>Time not provided</figcaption>
              </figure>
            )}
            {city && (
              <figure className="flex gap-2">
                <MapPin size={20} />
                <figcaption>{city}</figcaption>
              </figure>
            )}
            {ageString && (
              <figure className="flex gap-2">
                <Users size={20} />
                <figcaption>{ageString}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center py-[0.38rem] px-[0.75rem]">
        {isEnded ? (
          <p className="p-3">Completed</p>
        ) : registered && isAuthenticated ? (
          <ButtonCancel
            isFull={true}
            onClick={handleRegistration}
            disabled={loading}
          >
            <img src="src/assets/xIcon.svg" className="border-0" />
            {loading ? 'Processing...' : 'Cancel Registration'}
          </ButtonCancel>
        ) : (
          <Button
            isFull={true}
            onClick={handleRegistration}
            disabled={loading || participants >= maxParticipants}
          >
            <IoPersonAdd />
            {loading ? 'Processing...' : 'Register'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
