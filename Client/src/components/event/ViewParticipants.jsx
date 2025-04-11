import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import Participant from './Participant';

const ViewParticipants = ({ organizer, participants }) => {
  return (
    <div className="flex flex-col gap-6 p-2 rounded-xl min-w-64">
      <div className="flex flex-col gap-4 ">
        <h2 className="leading-5 text-heading-s font-[600]">Organizer</h2>
        <Participant 
        name={capitalizeFirstLetter(organizer.username)}
        profileImg={organizer.avatar}
        organizerId={organizer.id}
        />
      </div>
      {participants.length != 0 && (
        <>
          <div className="flex flex-col gap-4">
            <h2 className="leading-5 text-heading-s font-[600]">
              {participants.length == 1
                ? 'Participant'
                : `Participants (${participants.length})`}
            </h2>
            <div className="flex flex-col gap-5">
              {participants.map((participant, index) => (
                <Participant
                  name={capitalizeFirstLetter(participant.username)}
                  profileImg={participant.avatar}
                  rating={participant.rating}
                  id={participant.id}
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
