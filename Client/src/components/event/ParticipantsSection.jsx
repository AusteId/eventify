import React from 'react';
import Participant from './Participant';

const participans = [
  {
    name: 'Jonas Petronis',
  },
  {
    name: 'Jonas Petronis',
  },
  {
    name: 'Jonas Petronis',
  },
  {
    name: 'Jonas Petronis',
  },
];

const ParticipantsSection = () => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-light-gray rounded-xl">
      <div className="flex flex-col gap-4 ">
        <h2 className="leading-5 text-heading-s font-[600]">Organizer</h2>
        <Participant name={'Bossas Petronis'} />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="leading-5 text-heading-s font-[600]">Participants</h2>
        <div className="flex flex-col gap-3">
          {participans.map(participant => (
            <Participant name={participant.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsSection;
