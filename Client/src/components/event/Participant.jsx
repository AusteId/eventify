import { useEffect, useState } from 'react';
import { PiStarFill } from 'react-icons/pi';
import { Link } from 'react-router';
import { FaStar, FaRegStar } from 'react-icons/fa';

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

  const renderStars = (rating) => {
    const maxStars = 5;
    const stars = [];
    const fullStars = Math.floor(rating);
    const decimalPart = rating - fullStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-intermediate text-sm" />
      );
    }

    if (decimalPart > 0 && stars.length < maxStars) {
      const percentage = decimalPart * 100;
      stars.push(
        <div key="partial" className="relative inline-block">
          <FaRegStar className="text-gray-300 text-sm" />
          <FaStar
            className="text-intermediate text-sm absolute top-0 left-0"
            style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
          />
        </div>
      );
    }

    while (stars.length < maxStars) {
      stars.push(
        <FaRegStar
          key={`empty-${stars.length}`}
          className="text-gray-300 text-sm"
        />
      );
    }

    return stars;
  };

  return (
    <div className="flex justify-between max-h-14 items-center gap-3 p-2">
      <Link to={`/profile/${userId}`}>
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

          <div className="flex flex-col">
            <p className={`font-[600] ${isDarkMode && "text-[#f59e0b]"}`}>{name}</p>
          {rating && (
            <div className="flex items-center gap-1">
              {renderStars(rating)}
            </div>
          )}
          </div>
          </div>
      </Link>
    </div>
  );
};

export default Participant;
