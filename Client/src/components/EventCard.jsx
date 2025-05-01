'use client';

import { useEffect, useState } from 'react';
import Button from './Button';
import ButtonCancel from './ButtonCancel';
import { convertToCompactEuDatetime } from '../utils/dateFunctions';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { IoPersonAdd } from 'react-icons/io5';
import { FaRegStar } from 'react-icons/fa';
import joinEvent from '../helpers/event/joinEvent';
import cancelEvent from '../helpers/event/cancelEvent';
import { useAuth } from './Auth/AuthContext';
import toast from 'react-hot-toast';
import { Clock, MapPin, Timer, Trash2, Users } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useDarkMode } from './context/DarkModeContext.jsx';
import ThreePersonSVG from '../assets/threePersonSVG.jsx';
import DeleteModal from './DeleteModal.jsx';
import BannedButton from './Auth/BannedButton.jsx';

const EventCard = ({
  isAdmin = false,
  id,
  experienceLevel = 'All Welcome',
  isRegistered = 0,
  eventHandler,
  currentParticipants,
  maxParticipants,
  name = 'Title missing...',
  description,
  startDateTime,
  endDateTime,
  city = 'Location not provided',
  isEnded,
  minAge,
  maxAge,
  setRefresh
}) => {
  const navigate = useNavigate();
  const normalizedExpLevel = experienceLevel ? experienceLevel : 'All Welcome';
  const [imageData, setImageData] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [participants, setParticipants] = useState(currentParticipants ?? 0);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const {
    isAuthenticated,
    loading: authLoading,
    userId,
    birthDate,
    shortenContent,
    authFetch,
    roles
  } = useAuth() || {
    isAuthenticated: false,
    loading: false,
    userId: '',
    birthDate: null,
  };
  const [registered, setRegistered] = useState(isRegistered);

  const bannedRole = roles.find((role) => role.name === "BANNED");

  const { isDarkMode } = useDarkMode();

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
        console.error('Error fetching image:', error);
        setImageData('./src/assets/eventCardImgSample.png');
      } finally {
        setIsImageLoading(false);
      }
    };
    fetchImage();
  }, [id]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id || !isAuthenticated || !userId) {
        setRegistered(false);
        setParticipants(currentParticipants ?? 0);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_URL}/api/events/${id}`,
          {
            withCredentials: true,
          },
        );
        console.log('Full API response:', response.data);
        const registrations = response.data.registrations || [];
        setRegistered(response.data.isRegistered);
        setParticipants(registrations.length || 0);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setRegistered(false);
        setParticipants(currentParticipants ?? 0);
      }
    };
    fetchEventDetails();
  }, [id, isAuthenticated, userId]);

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
        const result = await cancelEvent(id);
        console.log('cancelEvent result:', result);
        setRegistered(false);
        setParticipants(prev => Math.max(prev - 1));
        toast.success('Registration has been successfully canceled.');
      } else {
        if (participants < maxParticipants) {
          const result = await joinEvent(id);
          console.log('joinEvent result:', result);
          setRegistered(true);
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
      console.error('Registration error:', error);
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

  const deleteEvent = async () => {
    try {
      const response = await authFetch(`http://localhost:8080/api/events/${id}`, {
        method: 'DELETE',
      });

      if (response && response.ok) {
        toast.success('Event deleted successfully');
        setDeleteModal(false);
        setRefresh(prev => prev + 1);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting event:', err);
      return false;
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-104 w-[22rem] desktop:max-w-[24.875rem]">
        <span className="loading loading-spinner loading-lg text-gray-500"></span>
      </div>
    );
  }

  return (
    <>
      {deleteModal && (
        <DeleteModal buttonAccept={'Delete'}
          buttonCancel={'Cancel'}
          closeModal={() => setDeleteModal(false)}
          warningMessage={'Are you sure you want to delete '}
          api={`/api/events/${id}/picture`}
          name={name}
          onClick={deleteEvent}
        />
      )}

      <div className='relative'>
        <div
          onClick={() => navigate(`/events/${id}`)}
          className={`cursor-pointer flex mt-0.5 mb-6 flex-col justify-between border duration-750 rounded-[0.5rem] h-104 desktop:h-108 w-[22rem] desktop:max-w-[24.875rem] shadow-[0_4px_6px_rgba(0,0,0,0.1),_0_2px_4px_rgba(0,0,0,0.1)] ${isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : 'bg-white border-transparent'} ${isEnded && 'grayscale-100'} relative`}
        >
          <div>
            <a
              className="cursor-pointer group"
            >
              <div className="relative">
                {participants >= 0 && maxParticipants > 0 && (
                  <div className="absolute flex top-2 left-2 bg-black/50 gap-1 rounded-full py-[0.38rem] px-[0.75rem] text-sm z-10">
                    <ThreePersonSVG />
                    <p className={`${isDarkMode ? 'text-gray-200' : 'text-white'}`}>
                      {participants}/{maxParticipants}
                    </p>
                  </div>
                )}
                {experienceLevel !== 0 && (
                  <div
                    className={`absolute right-2 top-2 ${expLevels[normalizedExpLevel][0] ?? ''} rounded-full py-1.5 px-3 text-[0.875rem] z-10`}
                  >
                    <p className={`${isDarkMode ? 'text-gray-200' : 'text-white'}`}>
                      {expLevels[normalizedExpLevel][1]}
                    </p>
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
                      console.log('Event image failed to load, using fallback');
                      setImageData('./src/assets/eventCardImgSample.png');
                    }}
                  />
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-[0.5rem]"></div>
              </div>
            </a>

            <div className="pt-5 px-5 flex flex-col gap-2 relative">
              {isAdmin && (
                <button
                  className="text-error absolute right-[3%] cursor-pointer duration-300 hover:translate-y-[1px] hover:text-red-500"
                  onClick={(e) => {
                    setDeleteModal(true)
                    e.stopPropagation();
                  }}
                >
                  <Trash2 className="w-8 h-8" />
                </button>
              )}
              <h2
                className={`text-heading-xs font-[600] leading-[1.125rem] duration-750 whitespace-nowrap overflow-hidden text-ellipsis ${isDarkMode ? 'text-[#f59e0b]' : 'text-header-black'}`}
              >
                {name}
              </h2>
              <p
                className={`h-12 font-inter  text-body-m ${isDarkMode ? 'text-gray-200' : 'text-body-medium'}`}
              >
                {shortenContent(shortDesc, 43)}
              </p>

              <div
                className={`flex flex-col gap-2 font-inter text-body-s ${isDarkMode ? 'text-gray-200' : 'text-body-medium'}`}
              >
                {startDateTime ? (
                  <figure className="flex gap-2">
                    <Clock
                      size={20}
                      className={`${isDarkMode && 'text-[#f59e0b]'}`}
                    />
                    {endDateTime ? (
                      <div className="flex gap-2">
                        <figcaption>{TimeString}</figcaption>
                        <figcaption className="flex gap-1">
                          <Timer
                            size={20}
                            className={`${isDarkMode && 'text-[#f59e0b]'}`}
                          />
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
                    <Clock
                      size={20}
                      className={`${isDarkMode && 'text-[#f59e0b]'}`}
                    />
                    <figcaption>Time not provided</figcaption>
                  </figure>
                )}
                {city && (
                  <figure className="flex gap-2">
                    <MapPin
                      size={20}
                      className={`${isDarkMode && 'text-[#f59e0b]'}`}
                    />
                    <figcaption>{city}</figcaption>
                  </figure>
                )}
                {ageString && (
                  <figure className="flex gap-2">
                    <Users
                      size={20}
                      className={`${isDarkMode && 'text-[#f59e0b]'}`}
                    />
                    <figcaption>{ageString}</figcaption>
                  </figure>
                )}
              </div>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="flex justify-center py-[0.38rem] px-[0.75rem]">
            {bannedRole ? <BannedButton isAuthenticated={isAuthenticated} roles={roles} size="" className="w-80" buttonName="Register" message="Cannot register while banned" /> :
              isEnded ? (
                <p className={`p-3 ${isDarkMode && 'text-gray-300'}`}>Completed</p>
              ) : registered && isAuthenticated ? (
                <ButtonCancel
                  isFull={true}
                  onClick={handleRegistration}
                  disabled={loading}

                >
                  <img
                    src="./src/assets/xIcon.svg"
                    className="border-0"
                    alt="Cancel"
                  />
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

        {isEnded && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-intermediate to-btn opacity-70 hover:opacity-100 blur-md transition duration-1000 animate-pulse rounded-full"></div>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="relative flex items-center gap-2 bg-gradient-to-r from-intermediate to-btn text-white rounded-full py-2 px-4 font-inter text-base hover:bg-gradient-to-r hover:from-btn hover:to-btn-hover transition-colors duration-200 cursor-pointer animate-pulse-slow"
            >
              <FaRegStar />
              Rate Organizer
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default EventCard;