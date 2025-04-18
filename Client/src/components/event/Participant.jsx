import { PiStarFill } from 'react-icons/pi';

const Participant = ({
  name,
  rating,
  organizerId,
  isDarkMode,
}) => {
// {`http://localhost:8080/api/users/${id}/avatar`}

  return (
    <div className="flex justify-between max-h-14 items-center gap-3 p-2">
      <div className="flex items-center gap-3">
        <div className="h-14">
          {' '}
          <img
            src={`http://localhost:8080/api/users/${organizerId}/avatar`}
            onError={e => {
              e.target.onerror = null;
              e.target.src =
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
            }}
            className="h-full object-cover rounded-full"
          />
        </div>
        <p className={`font-[600] ${isDarkMode && "text-[#f59e0b]"}`}>{name}</p>
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
