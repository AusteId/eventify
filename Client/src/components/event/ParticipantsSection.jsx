import { useEffect, useState } from 'react';
import Participant from './Participant';
import Modal from './Modal';
import ViewParticipants from './ViewParticipants';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import { useAuth } from '../Auth/AuthContext.jsx';
import axios from 'axios';

const ParticipantsSection = ({ organizer, participants }) => {
  const { isDarkMode } = useDarkMode();
  const { shortenContent } = useAuth();
  const [organizerData, setOrganizerData] = useState(organizer);
  const [organizerRating, setOrganizerRating] = useState(null);

  useEffect(() => {
    const rating = organizerData.ratingCount > 0 && typeof organizerData.averageRating === 'number' && organizerData.averageRating > 0
      ? organizerData.averageRating
      : null;
    setOrganizerRating(rating);
  }, [organizerData]);

  useEffect(() => {
    const fetchOrganizerRating = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_URL}/api/ratings/users/${organizer.id}/rating`,
          { withCredentials: true }
        );
        setOrganizerData({
          ...organizer,
          averageRating: response.data.averageRating,
          ratingCount: response.data.ratingCount,
        });
      } catch (error) {
        console.error('Error fetching organizer rating:', error);
        setOrganizerData({
          ...organizer,
          averageRating: 0,
          ratingCount: 0,
        });
      }
    };

    if (organizer && (!organizer.averageRating || !organizer.ratingCount)) {
      fetchOrganizerRating();
    }
  }, [organizer]);

  const handleClickViewParticipants = () => {
    document.getElementById('view_all_participants_modal').showModal();
  };

  return (
    <div className={`flex flex-col gap-6 p-6 border rounded-xl duration-750 ${isDarkMode ? "bg-slate-600/40 border-[#f59e0b]" : "bg-light-gray border-transparent"}`}>
      <div className="flex flex-col gap-4 ">
        <h2 className={`leading-5 text-heading-s font-[600] ${isDarkMode && "text-gray-200"}`}>Organizer</h2>
        <Participant
          name={shortenContent(organizer.username, 25)}
          userId={organizer.id}
          isDarkMode={isDarkMode}
          rating={organizerRating}
        />
      </div>
      {participants.length != 0 && (
        <>
          <div className="flex flex-col gap-4">
            <h2 className={`leading-5 text-heading-s font-[600] ${isDarkMode && "text-gray-200"}`}>
              {participants.length == 1
                ? 'Participant'
                : `Participants (${participants.length})`}
            </h2>
            <div className={`flex flex-col gap-5 ${isDarkMode && "text-[#f59e0b]"}`}>
              {participants.slice(0,3).map((participant, index) => (
                <Participant
                  name={shortenContent(participant.username, 15)}
                  profileImg={participant.avatar}
                  userId={participant.id}
                  key={index}
                />
              ))}
            </div>
            <div>
              <a
                onClick={handleClickViewParticipants}
                className="text-btn cursor-pointer hover:underline font-semibold text-[14px]"
              >
                View all participants
              </a>
            </div>
          </div>
        </>
      )}
      <div className="absolute">
        <Modal modalName={'view_all_participants_modal'} isDarkMode={isDarkMode}>
          <ViewParticipants organizer={organizer} participants={participants} isDarkMode={isDarkMode} />
        </Modal>
      </div>
    </div>
  );
};

export default ParticipantsSection;
