import Participant from './Participant';

const ViewParticipants = ({ participants }) => {
  return (
    <div className="flex flex-col gap-6 p-2 rounded-xl">
      <div className="flex flex-col gap-4 ">
        <h2 className="leading-5 text-heading-s font-[600]">Organizer</h2>
        <Participant name={'Bossas Petronis'} rating={2.4} />
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
                  name={participant.name}
                  rating={participant.rating}
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
