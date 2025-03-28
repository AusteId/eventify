import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import getEvent from '../helpers/event/getEvent';
import joinEvent from '../helpers/event/joinEvent';
import CalendarIcon from '../assets/event/calendar.svg?react';
import MarkIcon from '../assets/mapMarker.svg?react';
import Button from '../components/Button';
import CommentSection from '../components/CommentSection';
import ParticipantsSection from '../components/event/ParticipantsSection';
import EditIcon from '../assets/editIcon.svg?react';
import axios from 'axios';
import { useAuth } from '../components/Auth/AuthContext';
import toast from 'react-hot-toast';
import { CloudCog, Loader } from 'lucide-react';

const Event = () => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState();
  const params = useParams();
  const { userId } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const auth = useAuth();

  const handleJoinEvent = async () => {
    try {
      const data = await joinEvent(params.id);
      console.log("DATA: ",data);
      setEvent(data);
      setIsRegistered(true);
      toast.success('Successfully joined the event!');
    } catch (error) {
      toast.error('Error joining event: ' + error.message);
    }
  };

  const handleCancelEvent = async () => {
    try {
      const response = await cancelEvent(params.id);
      const updatedEvent = await getEvent(params.id);
      setEvent(updatedEvent);
      setIsRegistered(false);
      toast.success(response || 'Successfully cancelled registration!');
    } catch (error) {
      toast.error('Error cancelling registration: ' + error.message);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.loading) return;

        console.log("ID: ",params.id);
        
        const data = await getEvent(params.id);
        setEvent(data);
        setLoading(false);

        console.log("AUTH", auth);
        
  
        // const currentUserId = localStorage.getItem('userId');
        const isUserRegistered = data.registrations?.some(reg => reg.user.id === auth.userId);
        setIsRegistered(isUserRegistered || false);
      } catch (error) {
        console.log("ERROR:", error);
        
        toast.error('Error loading event: ' + error.message);
      }
    };
    fetchData();
  }, [params.id, auth.loading]);
 


  if (!event) {
    return <p>LOADING</p>;
  }


  if (auth.loading) return <Loader/>

console.log("AUTH END: ",auth);

  console.log(event);

  return (
    <div className="flex flex-col items-center gap-5 py-10 px-10 text-black">
      <div
        className={`flex flex-col justify-start gap-8 h-full p-8 bg-white rounded-xl tablet:items-baseline`}
      >
        <div className="flex items-center gap-10 w-full justify-between">
          <div className="flex flex-col gap-3">
            <h1
              className={`text-[2.25rem] font-[700] leading-[1.5rem] ${loading && 'text-start'}`}
            >
              {event.name}
            </h1>
            <div className="flex gap-2 items-center text-body-m text-body-medium">
              <CalendarIcon />
              <p>{event.startDateTime}</p>
              <MarkIcon />
              <p>{event.address}</p>
            </div>
          </div>
          <div>
            {isRegistered ? (
              <Button onClick={handleCancelEvent}>Cancel Registration</Button>
            ) : (
             <Button onClick={handleJoinEvent}>Join Event</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr] gap-6 w-full">
          {event.minAge ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">
                {event.minAge}-{event.maxAge}
              </p>
            </div>
          ) : (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Age Requirement</p>
              <p className="text-[#1F2937] font-[600]">All ages</p>
            </div>
          )}
          {event.minAge ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Participants</p>
              <p className="text-[#1F2937] font-[600]">
                {event.minAge}-{event.maxAge}
              </p>
            </div>
          ) : (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Participants</p>
              <p className="text-[#1F2937] font-[600]">No limits</p>
            </div>
          )}
          {event.minAge ? (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Category</p>
              <p className="text-[#1F2937] font-[600]">
                {event.minAge}-{event.maxAge}
              </p>
            </div>
          ) : (
            <div className="bg-light-gray rounded-lg p-4 text-heading-s">
              <p className="text-[#6B7280]">Category</p>
              <p className="text-[#1F2937] font-[600]">Any</p>
            </div>
          )}

          <div className="col-span-2">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-8">
                <h2 className="text-heading-s leading-5 font-[600] text-header-dark">
                  About the Event
                </h2>
                <p className="text-body-medium">{event.description}</p>
              </div>

              <CommentSection
                contextid={userId}
                endpoint={'/events/' + event.id + '/comments'}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <ParticipantsSection />
            <div className="flex justify-center px-6">
              <Button>{<EditIcon />} Manage event</Button>
            </div>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};
export default Event;
