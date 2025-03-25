import React from 'react';

const Participant = ({
  name,
  isHost,
  profileImg = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
}) => {
  return (
    <div className="flex max-h-14 items-center gap-3 p-2">
      <div className="h-14">
        <img src={profileImg} className="h-full object-cover" />
      </div>
      <p className="font-[600]">{name}</p>
      {/* {isHost && <p>Event Host</p>} */}
    </div>
  );
};

export default Participant;
