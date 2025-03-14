import { useEffect, useState } from 'react';
import defaultAvatar from '../../assets/profile-picture.webp';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../Auth/AuthContext';
const ProfilePictureButton = () => {
  const [avatar, setAvatar] = useState();
  const { timeourForError } = useNotification();
  const { authFetch } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState();

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

  const closeModal = () => {
    setIsAvatarModalOpen(false);
  };


  useEffect(() => {
    getUserAvatar();
  }, []);

  return (
    <>
      {avatar && isAvatarModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 flex justify-center items-center"
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
          <img
            src={avatar}
            alt="profile-photo-bigger"
            className="rounded-full h-[55vh] w-[45vw]"
          ></img>
          </div>
        </div>
      )}
      <section>
        <img
          src={avatar || defaultAvatar}
          alt="profile-photo"
          className="border-movie-fifth w-[3rem] h-[3rem] rounded-[1.5rem] mx-[0.3rem] cursor-pointer"
          onClick={() => setIsAvatarModalOpen(true)}
        />
      </section>
    </>
  );
};

export default ProfilePictureButton;
