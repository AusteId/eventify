import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import Participant from './Participant';

const ViewParticipants = ({ organizer, participants,isDarkMode }) => {
  return (
    <div className={`flex flex-col gap-6 p-2 rounded-xl min-w-64 ${isDarkMode && "bg-slate-900 text-[#f59e0b]"}`}>
      <div className="flex flex-col gap-4 ">
        <h2 className={`leading-5 text-heading-s font-[600] ${isDarkMode && "text-gray-200"}`}>Organizer</h2>
        <Participant 
        name={capitalizeFirstLetter(organizer.username)}
        profileImg={organizer.avatar}
        userId={organizer.id}
        
        />
      </div>
      {participants.length != 0 && (
        <>
          <div className={`flex flex-col gap-4 ${isDarkMode && "text-gray-200"}`}>
            <h2 className={`leading-5 text-heading-s font-[600]`}>
              {participants.length == 1
                ? 'Participant'
                : `Participants (${participants.length})`}
            </h2>
            <div className={`flex flex-col gap-5 ${isDarkMode && "text-[#f59e0b]"}`}>
              {participants.map((participant, index) => (
                <Participant
                  name={capitalizeFirstLetter(participant.username)}
                  profileImg={participant.avatar}
                  rating={participant.rating}
                  userId={participant.id}
                  key={index}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewParticipants;
