import { PiStarFill } from 'react-icons/pi';

const Participant = ({
  name,
  profileImg = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  rating,
}) => {
  return (
    <div className="flex justify-between max-h-14 items-center gap-3 p-2">
      <div className="flex items-center gap-3">
        <div className="h-14">
          <img src={profileImg} className="h-full object-cover rounded-full" />
        </div>
        <p className="font-[600]">{name}</p>
      </div>
      {rating && (
        <div className="flex items-center gap-1">
          <PiStarFill className="text-amber-400" />
          <p>{rating}</p>
        </div>
      )}
    </div>
  );
};

export default Participant;
