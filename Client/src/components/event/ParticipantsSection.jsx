import Participant from './Participant';
import Modal from './Modal';
import ViewParticipants from './ViewParticipants';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import { useAuth } from '../Auth/AuthContext.jsx';

const ParticipantsSection = ({ organizer, participants }) => {
  const { isDarkMode } = useDarkMode();
  const {shortenContent} = useAuth();
  const handleClickViewParticipants = () => {
    document.getElementById('view_all_participants_modal').showModal();
  };

  return (
    <div className={`flex flex-col gap-6 p-6 border rounded-xl duration-750 ${isDarkMode ? "bg-slate-600/40 border-[#f59e0b]" : "bg-light-gray border-transparent"}`}>
      <div className="flex flex-col gap-4 ">
        <h2 className={`leading-5 text-heading-s font-[600] ${isDarkMode && "text-gray-200"}`}>Organizer</h2>
        <Participant 
        name={shortenContent(organizer.username,25)}
        userId={organizer.id}
        isDarkMode={isDarkMode}
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
              {participants.map((participant, index) => (
                <Participant
                  name={shortenContent(participant.username,15)}
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
