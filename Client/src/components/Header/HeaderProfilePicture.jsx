import { useEffect, useState } from 'react';
import defaultAvatar from '../../assets/profile-picture.webp';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../Auth/AuthContext';
const ProfilePictureButton = () => {
  const [avatar, setAvatar] = useState();
  const { timeourForError } = useNotification();
  const { authFetch } = useAuth();

  const getUserAvatar = async () => {
    try {
      const response = await authFetch(
        'http://localhost:8080/api/users/avatar',
      );
      if (response.ok) {
        const blob = await response.blob();
        const image = URL.createObjectURL(blob);
        setAvatar(image);
      }
    } catch (error) {
      timeourForError(error.message || 'Failed to load avatar');
    }
  };

  useEffect(() => {
    getUserAvatar();
  }, []);

  return (
    <>
      <section>
        <img
          src={avatar || defaultAvatar}
          alt="profile-photo"
          className="border-movie-fifth w-[3rem] h-[3rem] rounded-[1.5rem] mx-[0.3rem]"
        />
      </section>
    </>
  );
};

export default ProfilePictureButton;
