import defaultAvatar from '../../assets/profile-picture.webp';
import { useAuth } from '../Auth/AuthContext';

const ProfilePictureButton = () => {
  const { avatar } = useAuth();

  return (
    <div className="avatar">
      <div className="bg-neutral text-neutral-content w-12 rounded-full">
        <img src={avatar || defaultAvatar} />
      </div>
    </div>
  );
};

export default ProfilePictureButton;
