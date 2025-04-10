import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router';
import EditIcon from '../assets/editIcon.svg?react';
import CalendarIcon from '../assets/event/calendar.svg?react';
import MarkIcon from '../assets/mapMarker.svg?react';
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

const Event = () => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const params = useParams();
  const { userId, isAuthenticated, birthDate } = useAuth();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const organizer = { username: event?.organizer.username };
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

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
        {
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
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
      console.error('Error canceling registration:', error.message);
      toast.error('Failed to cancel registration.');
    } finally {
      setIsCanceling(false);
    }
  };

  const closeCancelModal = () => {
    document.getElementById('cancel_confirmation_modal').close();
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const data = await getEvent(params.id);

        if (!data) {
          console.error('Failed to load event data');
          setLoading(false);
          return;
        }

        setEvent(data);

        const userRegistration =
          event.registrations && Array.isArray(event.registrations)
            ? event.registrations.some(
                reg => String(reg.userJoinToEvent?.userId) === String(userId),
              )
            : false;

        setIsRegistered(userRegistration);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }

      try {
        const pictureResponse = await getEventImage(params.id);
        setEventImage(URL.createObjectURL(pictureResponse));
      } catch (err) {
        console.error(err.message);
        setEventImage('../src/assets/eventCardImgSample.png');
      }
    };
    fetchdata();
  }, [params.id, userId]);

  useEffect(() => {}, [isRegistered]);

  if (!event) {
    return <p>LOADING</p>;
  }

  const participants = (event.registrations || []).map(registration => ({
    username: registration.userJoinToEvent.userName,
    avatar: registration.userJoinToEvent.userAvatar?.data
      ? `data:image/png;base64,${registration.userJoinToEvent.userAvatar.data}`
      : null,
  }));

  const handleEdit = () => {
    document.getElementById('event_creation_modal').showModal();
  };

  return (
    <div className="flex flex-col items-center gap-5 p-3 tablet:py-10 tablet:px-10 text-black">
      <div
        className={`flex flex-col w-125 desktop:w-200 tablet:w-150 justify-start gap-8 h-full p-5 tablet:p-8 bg-white rounded-xl tablet:items-baseline`}
      >
        <div className="w-full h-100 overflow-clip">
          <img src={eventImage} className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col tablet:flex-row tablet:items-center gap-5 tablet:gap-10 w-full justify-between">
          <div className="flex flex-col gap-5">
            <h1
              className={`text-[2.25rem] font-[700] leading-[1.5rem] ${loading && 'text-start'}`}
            >
              {event.name}
            </h1>
            <div className="flex flex-col tablet:flex-row gap-5 tablet:items-center text-body-m text-body-medium">
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <p>{prettifyDateTime(event.startDateTime)}</p>
              </div>
              <div className="flex items-center gap-2">
                <MarkIcon />
                <Link
                  to={`/events?eventId=${event.id}`}
                  className="text-body-medium text-btn hover:text-btn-hover hover:underline"
                >
                  {event.address}
                </Link>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            {isRegistrationOpen() && !isRegistered && (
              <Button onClick={handleRegister} disabled={isJoining}>
                {isJoining ? 'Joining...' : 'Join Event'}
              </Button>
            )}
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
        <div className="flex flex-col tablet:grid grid-cols-[1fr_1fr_1fr] gap-6 w-full">
          {event.minAge && event.maxAge ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">
                {event.minAge} - {event.maxAge}
              </p>
            </div>
          ) : event.minAge && !event.maxAge ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">from {event.minAge}</p>
            </div>
          ) : !event.minAge && event.maxAge ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s ">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">up to {event.maxAge}</p>
            </div>
          ) : (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s text-center content-center">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">All ages</p>
            </div>
          )}
          {event.maxParticipants ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s text-center content-center">
              <p className="text-[#6B7280]">Participants</p>
              <p className="text-[#1F2937] font-[600]">
                {event.registrations.length} / {event.maxParticipants}
              </p>
            </div>
          ) : (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s text-center content-center">
              <p className="text-[#6B7280]">Participants</p>
              <p className="text-[#1F2937] font-[600]">No limits</p>
            </div>
          )}
          {event.category.name ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s text-center content-center">
              <p className="text-[#6B7280]">Category</p>
              <p className="text-[#1F2937] font-[600]">
                {event?.category.name.charAt(0).toUpperCase() +
                  event.category.name.slice(1)}
              </p>
            </div>
          ) : (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s text-center content-center">
              <p className="text-[#6B7280]">Category</p>
              <p className="text-[#1F2937] font-[600]">Any</p>
            </div>
          )}

          {event.description && (
            <div className="tablet:hidden flex flex-col gap-4 tablet:gap-8">
              <h2 className="text-heading-s leading-5 font-[600] text-header-dark">
                About the Event
              </h2>
              <p className="text-body-medium">{event.description}</p>
            </div>
          )}

          <div className="order-2 tablet:order-none col-span-2">
            <div className="flex flex-col gap-8">
              {event.description && (
                <div className="hidden tablet:flex flex-col gap-4 tablet:gap-8">
                  <h2 className="text-heading-s leading-5 font-[600] text-header-dark">
                    About the Event
                  </h2>
                  <p className="text-body-medium">{event.description}</p>
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
              >
                <div className="p-4 flex flex-col gap-4">
                  <h2 className="text-xl flex justify-center font-bold">
                    Cancel Confirmation
                  </h2>
                  <p>
                    Are you sure you want to cancel registration for this event?
                  </p>
                  <div className="flex justify-evenly gap-2">
                    <Button onClick={confirmCancel} variant="primary">
                      Yes
                    </Button>
                    <Button
                      onClick={closeCancelModal}
                      background="bg-white"
                      textColor="text-body-medium"
                      hoverColor="hover:bg-gray-100"
                      border="border border-input-light"
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
  );
};
export default Event;
