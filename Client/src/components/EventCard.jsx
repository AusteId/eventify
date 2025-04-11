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

const EventCard = ({
  id,
  experienceLevel = 'All Welcome',
  eventHandler,
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
  const [participants, setParticipants] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const {
    isAuthenticated,
    loading: authLoading,
    birthDate,
    checkEventRegistration,
  } = useAuth() || {
    isAuthenticated: false,
    loading: false,
    birthDate: null,
    checkEventRegistration: () => ({
      isRegistered: false,
      currentParticipants: 0,
    }),
  };
  const [registered, setRegistered] = useState(0);

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

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (isRegistering) {
        console.log(
          'Skipping fetchRegistrationStatus due to ongoing registration',
        );
        return;
      }
      setIsEventLoading(true);
      try {
        const { isRegistered, currentParticipants } = await checkEventRegistration(id);
        console.log('fetchRegistrationStatus:', { isRegistered, currentParticipants });

        const adjustedParticipants = isRegistered && currentParticipants === 0 ? 1 : currentParticipants;

        setRegistered(isRegistered ? 1 : 0);
        setParticipants(adjustedParticipants);
        console.log('fetchRegistrationStatus updated state:', { registered: isRegistered ? 1 : 0, participants: adjustedParticipants });
      } catch (error) {
        console.error('Error fetching registration status:', error);
        setRegistered(0);
        setParticipants(0);
      } finally {
        setIsEventLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchRegistrationStatus();
    } else {
      setRegistered(0);
      setParticipants(0);
      setIsEventLoading(false);
    }
  }, [id, isAuthenticated, checkEventRegistration, isRegistering]);

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

  const isRegistrationOpen = () => {
    const now = new Date();
    const startDate = new Date(startDateTime);
    const isOpen = participants < maxParticipants && now < startDate && !isEnded;
    console.log('isRegistrationOpen check:', {
      participants,
      maxParticipants,
      now,
      startDate,
      isEnded,
      isOpen,
    });
    return isOpen;
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

    if (!isRegistrationOpen()) {
      console.log('Registration closed: Event has started or is full');
      toast.error('Registration is closed because the event has started or is full.');
      return;
    }

    setLoading(true);
    setIsRegistering(true);
    try {
      if (registered) {
        await cancelEvent(id);
        setRegistered(0);
        setParticipants(prev => Math.max(0, prev - 1));
        toast.success('Registration has been successfully canceled.');
      } else {
        await joinEvent(id);
        setRegistered(1);
        setParticipants(prev => prev + 1);
        toast.success(`You're registered to ${name}!`);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      const {
        isRegistered: updatedIsRegistered,
        currentParticipants: updatedParticipants,
      } = await checkEventRegistration(id);
      console.log('handleRegistration sync:', {
        updatedIsRegistered,
        updatedParticipants,
      });
      setRegistered(updatedIsRegistered ? 1 : 0);
      setParticipants(updatedParticipants);

      if (eventHandler) eventHandler();
    } catch (error) {
      const errorMessage = error.error || 'Something went wrong. Try it again.';
      toast.error(errorMessage);
      setRegistered(registered ? 1 : 0);
      setParticipants(participants);
    } finally {
      setLoading(false);
      setIsRegistering(false);
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

  const timeString =
    startDateTime && endDateTime
      ? `${convertToCompactEuDatetime(startDateTime)} - ${formatToOnlyTime(endDateTime)}`
      : 'N/A';

  const ageString =
    minAge !== null && maxAge !== null
      ? `Min age: ${minAge} - max age: ${maxAge}`
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
          <p className="h-12">{shortDesc}</p>
          <div className="flex flex-col gap-1">
            {startDateTime ? (
              <figure className="flex gap-2">
                <img src="src/assets/clock.svg" alt="Icon of a clock" />
                {endDateTime ? (
                  <figcaption>{timeString}</figcaption>
                ) : (
                  <figcaption>
                    {convertToCompactEuDatetime(startDateTime)}
                  </figcaption>
                )}
              </figure>
            ) : (
              <figure className="flex gap-2">
                <img src="src/assets/clock.svg" alt="Icon of a clock" />
                <figcaption>Time not provided</figcaption>
              </figure>
            )}
            {city && (
              <figure className="flex gap-2">
                <img src="src/assets/mapMarker.svg" alt="Icon of map marker" />
                <figcaption>{city}</figcaption>
              </figure>
            )}
            {ageString && (
              <figure className="flex gap-2">
                <img src="src/assets/age.svg" alt="Icon representing age" />
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
        ) : isRegistrationOpen() ? (
          <Button
            isFull={true}
            onClick={handleRegistration}
            disabled={loading}
          >
            <IoPersonAdd />
            {loading ? 'Processing...' : 'Register'}
          </Button>
        ) : (
          <p className=" border-0 bg-gray-200 w-full rounded-2xl text-center p-3 text-gray-500 ">
            {new Date() >= new Date(startDateTime) ? 'Event has started' : 'Event is full'}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCard;