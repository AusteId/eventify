import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router';
import EditIcon from '../assets/editIcon.svg?react';
import { useAuth } from '../components/Auth/AuthContext';
import Button from '../components/Button';
import CommentSection from '../components/CommentSection';
import CreateEventForm from '../components/CreateEventForm';
import Modal from '../components/event/Modal';
import ParticipantsSection from '../components/event/ParticipantsSection';
import cancelEvent from '../helpers/event/cancelEvent';
import getEvent from '../helpers/event/getEvent';
import getEventImage from '../helpers/event/getEventImage';
import joinEvent from '../helpers/event/joinEvent';
import { prettifyDateTime } from '../utils/dateFunctions';
import LoadingScreen from '../components/message/LoadingScreen';
import CalendarSVG from '../assets/event/CalendarSVG';
import MapMarkerSVG from '../assets/mapMarkerSVG';
import { useDarkMode } from '../components/context/DarkModeContext.jsx';
import DeleteModal from '../components/DeleteModal.jsx';
import { Trash2 } from 'lucide-react';
import BannedButton from '../components/Auth/BannedButton.jsx';

const Event = () => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const params = useParams();
  const { userId, isAuthenticated, birthDate, roles, authFetch } = useAuth();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const organizer = {
    username: event?.organizer.username,
    id: event?.organizer.id,
  };
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { isDarkMode } = useDarkMode();

  const adminRole = roles.find((role) => role.name === "ADMIN")
  const bannedRole = roles.find((role) => role.name === "BANNED")

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

    if (!userAge && !event?.minAge && !event?.maxAge) return true;
    if (!userAge) return false;

    const minAge = event?.minAge;
    const maxAge = event?.maxAge;

    if (!minAge && !maxAge) return true;

    if (minAge && userAge < minAge) return false;
    if (maxAge && userAge > maxAge) return false;
    return true;
  };

  const isOrganizer = () => {
    return String(userId) === String(event?.organizer.id);
  };

  const isRegistrationOpen = () => {
    if (!event) return false;
    const now = new Date();
    const startDate = new Date(event?.startDateTime);
    return (
      event?.maxParticipants > (event?.registrations?.length || 0) &&
      now < startDate
    );
  };

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const [data, pictureResponse] = await Promise.all([
        getEvent(params.id),
        getEventImage(params.id).catch(() => null),
      ]);

      if (!data) {
        console.error('Failed to load event data');
        return;
      }

      setEvent({
        ...data,
        picture: pictureResponse ? URL.createObjectURL(pictureResponse) : null,
      });

      const userRegistration =
        data.registrations && Array.isArray(data.registrations)
          ? data.registrations.some(
              reg => String(reg.userJoinToEvent?.userId) === String(userId),
            )
          : false;
      setIsRegistered(userRegistration);

      setEventImage(
        pictureResponse
          ? URL.createObjectURL(pictureResponse)
          : '../src/assets/eventCardImgSample.png',
      );
    } catch (err) {
      console.error('Error fetching data:', err.message);
      setEventImage('../src/assets/eventCardImgSample.png');
      toast.error('Failed to load event data.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async () => {
    try {
      const response = await authFetch(`http://localhost:8080/api/events/${event.id}`, {
        method: 'DELETE',
      });

      if (response && response.ok) {
        toast.success('Event deleted successfully');
        navigate("/events")
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting event:', err);
      return false;
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/event/${params.id}`);
      return;
    }

    if (!isAgeValid()) {
      toast.error('Your age does not meet the requirements of the event.');
      return;
    }

    if (isOrganizer()) {
      toast.error('An organizer cannot register for their own event.');
      return;
    }

    try {
      await joinEvent(params.id);
      setIsRegistered(true);
      const [updatedEventData, pictureResponse] = await Promise.all([
        getEvent(params.id),
        getEventImage(params.id),
      ]);
      setEvent({
        ...updatedEventData,
        picture: URL.createObjectURL(pictureResponse),
      });

      toast.success(
        `Successfully registered for ${updatedEventData.name}! See you on ${prettifyDateTime(updatedEventData.startDateTime)}.`,
      );
    } catch (error) {
      const errorMessage = error.error || 'Failed to register. Try again.';
      toast.error(errorMessage);
    } finally {
      setIsJoining(false);
    }
  };

  const handleCancel = () => {
    if (!isAuthenticated) {
      return;
    }
    document.getElementById('cancel_confirmation_modal').showModal();
  };

  const confirmCancel = async () => {
    setIsCanceling(true);
    try {
      await cancelEvent(params.id);
      setIsRegistered(false);
      const [updatedEventData, pictureResponse] = await Promise.all([
        getEvent(params.id),
        getEventImage(params.id),
      ]);
      setEvent({
        ...updatedEventData,
        picture: URL.createObjectURL(pictureResponse),
      });

      toast.success(`Registration for ${updatedEventData.name} canceled.`, {});
      document.getElementById('cancel_confirmation_modal').close();
    } catch (error) {
      // console.error('Error canceling registration:', error.message);
      // toast.error('Failed to cancel registration.');
    } finally {
      setIsCanceling(false);
    }
  };

  const closeCancelModal = () => {
    document.getElementById('cancel_confirmation_modal').close();
  };

  useEffect(() => {
    fetchEventData();
  }, [params.id, userId, isRegistered]);

  useEffect(() => {}, [isRegistered]);

  if (loading || !event) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  const participants = (event.registrations || []).map(registration => ({
    username: registration.userJoinToEvent.userName,
    avatar: registration.userJoinToEvent.userAvatar?.data
      ? `data:image/png;base64,${registration.userJoinToEvent.userAvatar.data}`
      : null,
    id: registration.userJoinToEvent.userId,
  }));

  const handleEdit = () => {
    document.getElementById('event_creation_modal').showModal();
  };

  const secureClick = () => {
    if (!adminRole) {
      toast.error("Unauthorized");
      return;
    }
    setDeleteModal(true);
  }

  const closeModal = () => {
    setDeleteModal(false);
  }

  return (
    <>
      {deleteModal && (
        <DeleteModal buttonAccept={'Delete'}
                     buttonCancel={'Cancel'}
        closeModal={closeModal}
                     warningMessage={'Are you sure you want to delete '}
                     api={`/api/events/${event.id}/picture`}
                     name={event.name}
                     onClick={deleteEvent}
        />
      )}
      <div
        className={`flex flex-col items-center gap-5 p-3 tablet:py-10 tablet:px-10  ${isDarkMode ? 'text-gray-200' : 'text-black'}`}
      >
        <div
          className={`relative flex flex-col w-125 desktop:w-200 tablet:w-150 justify-start gap-8 h-full p-5 tablet:p-8 border duration-750  ${isDarkMode ? 'border-[#f59e0b] bg-slate-900' : 'border-transparent bg-white'} rounded-xl tablet:items-baseline`}
        >
          {adminRole && (
            <button
              className="text-error absolute right-[3%] cursor-pointer duration-300 hover:translate-y-[1px] hover:text-red-500"
              onClick={secureClick}
            >
              <Trash2 className="w-8 h-8" />
            </button>
          )}
          <div className="w-full h-100 overflow-clip">
            <img src={eventImage} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col tablet:flex-row tablet:items-center gap-5 tablet:gap-10 w-full justify-between">
            <div className="flex flex-col gap-5">
              <h1
                className={`text-[2.25rem]   
break-all    
whitespace-normal     
 font-[700] leading-[2.2rem] ${loading && 'text-start'}`}
              >
                {event.name}
              </h1>
              <div className="flex flex-col tablet:flex-row gap-5 tablet:items-center text-body-m text-body-medium">
                <div className="flex items-center gap-2">
                  <CalendarSVG />
                  <p
                    className={`duration-750 ${isDarkMode && 'text-gray-300'}`}
                  >
                    {prettifyDateTime(event.startDateTime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MapMarkerSVG />
                  <Link
                    to={`/events?eventId=${event.id}`}
                    className={` duration-750 ${isDarkMode ? 'hover:text-btn-hover hover:underline text-gray-300' : 'text-btn hover:text-btn-hover hover:underline'} `}
                  >
                    {event.address}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              {(isRegistrationOpen() && !isRegistered && !bannedRole) ? (
                <Button onClick={handleRegister} disabled={isJoining}>
                  {isJoining ? 'Joining...' : 'Join Event'}
                </Button>
              ) : <BannedButton isAuthenticated={isAuthenticated} roles={roles} size="" buttonName="Join Event" message="Cannot join event while banned"  />}
              {isRegistered && (
                <Button
                  onClick={handleCancel}
                  variant="secondary"
                  disabled={isCanceling}
                >
                  {isCanceling ? 'Canceling...' : 'Leave Event'}
                </Button>
              )}
              {userId == event.organizer.id && (
                <div className="tablet:hidden">
                  <Button>{<EditIcon />} Manage event</Button>
                </div>
              )}
            </div>
          </div>
          <div
            className={`flex flex-col tablet:grid grid-cols-[1fr_1fr_1fr] gap-6 w-full`}
          >
            {event.minAge && event.maxAge ? (
              <div
                className={`duration-750 text-center rounded-lg p-4 text-heading-s border ${isDarkMode ? 'bg-slate-600/40 border-[#f59e0b]' : 'bg-light-gray border-transparent'}`}
              >
                <p
                  className={`Duration ${isDarkMode ? 'text-gray-300' : 'text-[#6B7280]'}`}
                >
                  Age Requirement
                </p>
                <p
                  className={`font-[600] ${isDarkMode ? 'text-[#f59e0b]' : 'text-[#1F2937]'}`}
                >
                  {event.minAge} - {event.maxAge}
                </p>
              </div>
            ) : event.minAge && !event.maxAge ? (
              <div
                className={`duration-750 rounded-lg p-4 text-heading-s border ${isDarkMode ? 'bg-slate-600/40 border-[#f59e0b]' : 'bg-light-gray border-transparent'}`}
              >
                <p
                  className={`Duration ${isDarkMode ? 'text-gray-300' : 'text-[#6B7280]'}`}
                >
                  Age Requirement
                </p>
                <p
                  className={`font-[600] ${isDarkMode ? 'text-[#f59e0b]' : 'text-[#1F2937]'}`}
                >
                  from {event.minAge}
                </p>
              </div>
            ) : !event.minAge && event.maxAge ? (
              <div
                className={`duration-750 rounded-lg p-4 text-heading-s border ${isDarkMode ? 'bg-slate-600/40 border-[#f59e0b]' : 'bg-light-gray border-transparent'}`}
              >
                <p
                  className={`Duration ${isDarkMode ? 'text-gray-300' : 'text-[#6B7280]'}`}
                >
                  Age Requirement
                </p>
                <p
                  className={`font-[600] ${isDarkMode ? 'text-[#f59e0b]' : 'text-[#1F2937]'}`}
                >
                  up to {event.maxAge}
                </p>
              </div>
            ) : (
              <div
                className={`duration-750 rounded-lg p-4 text-heading-s border ${isDarkMode ? 'bg-slate-600/40 border-[#f59e0b]' : 'bg-light-gray border-transparent'}`}
              >
                <p
                  className={`Duration ${isDarkMode ? 'text-gray-300' : 'text-[#6B7280]'}`}
                >
                  Age Requirement
                </p>
                <p
                  className={`font-[600] ${isDarkMode ? 'text-[#f59e0b]' : 'text-[#1F2937]'}`}
                >
                  All ages
                </p>
              </div>
            )}
            {event.maxParticipants ? (
              <div
                className={`duration-750 rounded-lg p-4 text-center content-center text-heading-s border ${isDarkMode ? 'bg-slate-600/40 border-[#f59e0b]' : 'bg-light-gray border-transparent'}`}
              >
                <p
                  className={`Duration ${isDarkMode ? 'text-gray-300' : 'text-[#6B7280]'}`}
                >
                  Participants
                </p>
                <p
                  className={`font-[600] ${isDarkMode ? 'text-[#f59e0b]' : 'text-[#1F2937]'}`}
                >
                  {event.registrations.length} / {event.maxParticipants}
                </p>
              </div>
            ) : (
              <div
                className={`duration-750 rounded-lg p-4 text-center content-center text-heading-s border ${isDarkMode ? 'bg-slate-600/40 border-[#f59e0b]' : 'bg-light-gray border-transparent'}`}
              >
                <p
                  className={`Duration ${isDarkMode ? 'text-gray-300' : 'text-[#6B7280]'}`}
                >
                  Participants
                </p>
                <p
                  className={`font-[600] ${isDarkMode ? 'text-[#f59e0b]' : 'text-[#1F2937]'}`}
                >
                  No limits
                </p>
              </div>
            )}
            {event.category.name ? (
              <div
                className={`duration-750 rounded-lg p-4 text-center content-center text-heading-s border ${isDarkMode ? 'bg-slate-600/40 border-[#f59e0b]' : 'bg-light-gray border-transparent'}`}
              >
                <p
                  className={`Duration ${isDarkMode ? 'text-gray-300' : 'text-[#6B7280]'}`}
                >
                  Category
                </p>
                <p
                  className={`font-[600] ${isDarkMode ? 'text-[#f59e0b]' : 'text-[#1F2937]'}`}
                >
                  {event?.category.name.charAt(0).toUpperCase() +
                    event.category.name.slice(1)}
                </p>
              </div>
            ) : (
              <div
                className={`duration-750 rounded-lg p-4 text-center content-center text-heading-s border ${isDarkMode ? 'bg-slate-600/40 border-[#f59e0b]' : 'bg-light-gray border-transparent'}`}
              >
                <p
                  className={`Duration ${isDarkMode ? 'text-gray-300' : 'text-[#6B7280]'}`}
                >
                  Category
                </p>
                <p
                  className={`font-[600] ${isDarkMode ? 'text-[#f59e0b]' : 'text-[#1F2937]'}`}
                >
                  Any
                </p>
              </div>
            )}

            {event.description && (
              <div className="tablet:hidden flex flex-col gap-4 tablet:gap-8">
                <h2
                  className={`text-heading-s leading-5 font-[600]  ${isDarkMode ? 'text-gray-200' : 'text-header-dark'}`}
                >
                  About the Event
                </h2>
                <p
                  className={`break-all whitespace-normal ${isDarkMode ? 'text-gray-300' : 'text-body-medium'}`}
                >
                  {event.description}
                </p>
              </div>
            )}

            <div className="order-2 tablet:order-none col-span-2">
              <div className="flex flex-col gap-8">
                {event.description && (
                  <div className="hidden tablet:flex flex-col gap-4 tablet:gap-8">
                    <h2
                      className={`text-heading-s leading-5 font-[600]  ${isDarkMode ? 'text-gray-200' : 'text-header-dark'}`}
                    >
                      About the Event
                    </h2>
                    <p
                      className={`break-all whitespace-normal text-body-medium ${isDarkMode ? 'text-gray-300' : 'text-header-dark'}`}
                    >
                      {event.description}
                    </p>
                  </div>
                )}

                <CommentSection
                  contextId={userId}
                  endpoint={'/events/' + event.id + '/comments'}
                />
              </div>
            </div>
            <div className="order-1 tablet:order-none flex flex-col gap-4">
              <ParticipantsSection
                organizer={organizer}
                participants={participants}
              />
              {userId == event.organizer.id && (
                <div className="hidden tablet:flex justify-center px-6">
                  <Button onClick={handleEdit}>
                    {<EditIcon />} Manage event
                  </Button>
                </div>
              )}
              <div className="absolute">
                <Modal modalName={'event_creation_modal'}>
                  <CreateEventForm />
                </Modal>
                <Modal
                  modalName="cancel_confirmation_modal"
                  isOpen={isCancelModalOpen}
                  isDarkMode={isDarkMode}
                >
                  <div
                    className={`p-4 flex flex-col gap-4 duration-750 ${isDarkMode && 'bg-slate-900'}`}
                  >
                    <h2 className="text-xl flex justify-center font-bold">
                      Cancel Confirmation
                    </h2>
                    <p>
                      Are you sure you want to cancel registration for this
                      event?
                    </p>
                    <div className="flex justify-evenly gap-2">
                      <Button onClick={confirmCancel} variant="primary">
                        Yes
                      </Button>
                      <Button
                        onClick={closeCancelModal}
                        background={`${isDarkMode ? 'bg-slate-600' : 'bg-white'} duration-200`}
                        textColor={`${isDarkMode ? 'text-gray-200' : 'text-medium'}`}
                        hoverColor={`${isDarkMode ? 'hover:bg-slate-700 hover:text-[#f59e0b]' : 'hover:bg-gray-100'}`}
                        border={`border ${isDarkMode ? 'border-[#f59e0b]' : 'border border-input-light'}`}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Event;
