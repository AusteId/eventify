import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import getEvent from '../helpers/event/getEvent';
import CalendarIcon from '../assets/event/calendar.svg?react';
import MarkIcon from '../assets/mapMarker.svg?react';
import Button from '../components/Button';
import CommentSection from '../components/CommentSection';
import ParticipantsSection from '../components/event/ParticipantsSection';
import EditIcon from '../assets/editIcon.svg?react';
import Modal from '../components/event/Modal';
import CreateEventForm from '../components/CreateEventForm';
import { useAuth } from '../components/Auth/AuthContext';
import { prettifyDateTime } from '../utils/dateFunctions';
import getEventImage from '../helpers/event/getEventImage';

// const participants = [
//   {
//     name: 'Kestas Bombonis',
//     rating: 4.3,
//   },
//   {
//     name: 'Tomas Kurtauskas',
//     rating: 2.8,
//   },
//   {
//     name: 'Marius Maironis',
//     rating: 3.5,
//   },
//   {
//     name: 'Jonas Petronis',
//     rating: 1.2,
//   },
// ];

const Event = () => {
  const [loading] = useState(true);
  const [event, setEvent] = useState();
  const params = useParams();
  const { userId } = useAuth();
  const participants = event?.registrations.map(registration => {
    return {
      username: registration.userJoinToEvent.userName,
      avatar: `data:image/png;base64,${registration.userJoinToEvent.userAvatar.data}`,
    };
  });
  const organizer = { username: event?.organizer.username };

  useEffect(() => {
    const fetchdata = async () => {
      const data = await getEvent(params.id);
      const pictureResponse = await getEventImage(params.id);

      setEvent({ ...data, picture: URL.createObjectURL(pictureResponse) });
    };
    fetchdata();
  }, []);

  if (!event) {
    return <p>LOADING</p>;
  }

  const handleEdit = () => {
    document.getElementById('event_creation_modal').showModal();
  };

  console.log(event);
  console.log('EVENT DESCRIPTION: ', event.description ? 'TRUE' : 'FALSE');

  return (
    <div className="flex flex-col items-center gap-5 p-3 tablet:py-10 tablet:px-10 text-black">
      <div
        className={`flex flex-col justify-start gap-8 h-full p-5 tablet:p-8 bg-white rounded-xl tablet:items-baseline`}
      >
        <div className="w-full flex justify-center">
          {/* <img src={event.picture} className="max-w-full h-auto" /> */}
          <img src={event.picture} className="w-full h-full object-cover" />
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
                <p>{event.address}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button>Join Event</Button>
            <div className="tablet:hidden">
              <Button>{<EditIcon />} Manage event</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col tablet:grid grid-cols-[1fr_1fr_1fr] gap-6 w-full">
          {event.minAge && event.maxAge ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">
                {event.minAge}-{event.maxAge}
              </p>
            </div>
          ) : event.minAge && !event.maxAge ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">from {event.minAge}</p>
            </div>
          ) : !event.minAge && event.maxAge ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">up to {event.maxAge}</p>
            </div>
          ) : (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">All ages</p>
            </div>
          )}
          {event.maxParticipants ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Participants</p>
              <p className="text-[#1F2937] font-[600]">
                {event.registrations.length}-{event.maxParticipants}
              </p>
            </div>
          ) : (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Participants</p>
              <p className="text-[#1F2937] font-[600]">No limits</p>
            </div>
          )}
          {event.category.name ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Category</p>
              <p className="text-[#1F2937] font-[600]">
                {event?.category.name.charAt(0).toUpperCase() +
                  event.category.name.slice(1)}
              </p>
            </div>
          ) : (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
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
            <div className="hidden tablet:flex justify-center px-6">
              <Button onClick={handleEdit}>{<EditIcon />} Manage event</Button>
            </div>
            <div className="absolute">
              <Modal modalName={'event_creation_modal'}>
                <CreateEventForm />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Event;
