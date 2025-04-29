import { useEffect, useState } from 'react';
import { PiStarFill } from 'react-icons/pi';

const Participant = ({
  name,
  rating,
  userId,
  isDarkMode,
}) => {
// {`http://localhost:8080/api/users/${id}/avatar`}

const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAvatar = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}/avatar`);
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setAvatarUrl(imageUrl);
        } else {
          setAvatarUrl('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
        }
      } catch (err) {
        console.error('Avatar fetch error:', err);
        setAvatarUrl('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
      }
    };

    fetchAvatar();

    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [userId]);

  return (
    <div className="flex justify-between max-h-14 items-center gap-3 p-2">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14">
          {' '}
          <img
            src={avatarUrl}
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
