import defaultAvatar from '../../assets/profile-picture.webp';
import { useAuth } from '../Auth/AuthContext';

const ProfilePictureButton = () => {

  const { avatar } = useAuth();

  return (
    <section>
      <img
        src={avatar || defaultAvatar}
        alt="profile-photo"
        className="border-movie-fifth w-[3rem] h-[3rem] rounded-[1.5rem] mx-[0.3rem]"
      />
    </section>
  );
};

export default ProfilePictureButton;
