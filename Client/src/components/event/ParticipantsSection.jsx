import Participant from './Participant';
import Modal from './Modal';
import ViewParticipants from './ViewParticipants';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';

const ParticipantsSection = ({ organizer, participants }) => {
  const handleClickViewParticipants = () => {
    document.getElementById('view_all_participants_modal').showModal();
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-light-gray rounded-xl">
      <div className="flex flex-col gap-4 ">
        <h2 className="leading-5 text-heading-s font-[600]">Organizer</h2>
        <Participant name={capitalizeFirstLetter(organizer.username)} />
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
        <Modal modalName={'view_all_participants_modal'}>
          <ViewParticipants organizer={organizer} participants={participants} />
        </Modal>
      </div>
    </div>
  );
};

export default ParticipantsSection;
