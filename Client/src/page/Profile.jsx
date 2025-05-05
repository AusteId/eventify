import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../components/Auth/AuthContext';
import BasicModal from '../components/BasicModal';
import Button from '../components/Button';
import CommentSection from '../components/CommentSection';
import { useDarkMode } from '../components/context/DarkModeContext';
import EditProfileForm from '../components/EditProfileForm';
import InterestsSection from '../components/InterestsSection';
import LoadingScreen from '../components/message/LoadingScreen';
import NotFound from './NotFound';

const Profile = () => {
  const [profileData, SetProfileData] = useState([]);
  const [userFound, setUserFound] = useState(true);
  const { pUserId } = useParams();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_URL}/api/users/${pUserId}`,
        );
        console.log(response.data);
        SetProfileData(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUserFound(false);
      }
    };
    getProfileData();
  }, [pUserId]);

  if (!userFound) {
    return <NotFound />;
  }

  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen">
      <BasicModal id="edit_profile_modal">
        <EditProfileForm
          userCategories={profileData.favoriteEventCategories}
          pUserId={pUserId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          description={profileData.description}
        />
      </BasicModal>
      <div className="tablet:w-224 mx-auto pb-8">
        <div
          className={
            isDarkMode
              ? 'w-full h-auto p-8 mt-8 rounded-2xl shadow-md bg-slate-900'
              : 'w-full h-auto p-8 mt-8 rounded-2xl shadow-md bg-white'
          }
        >
          <div className="size-full">
            <div className="flex w-full h-32">
              <img
                className="w-32 h-32 rounded-full"
                src={`http://localhost:8080/api/users/${pUserId}/avatar`}
                alt="Avatar"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '../src/assets/avatar.png';
                }}
              />
              <div className="ml-8">
                <div className="flex items-center">
                  <h1
                    className={
                      isDarkMode
                        ? 'text-[#f59e0b] font-inter font-bold text-heading-m text-nowrap'
                        : 'text-header-dark font-inter font-bold text-heading-m text-nowrap'
                    }
                  >
                    {profileData.username}
                  </h1>
                  <p
                    className={
                      isDarkMode
                        ? 'text-slate-400 font-inter items-baseline ml-3'
                        : 'text-[#6B7280] font-inter items-baseline ml-3'
                    }
                  >
                    {calculateAge(profileData.birthDate)}
                  </p>
                </div>
                <div className="flex items-center">
                  <p
                    className={
                      isDarkMode
                        ? 'font-inter text-slate-400 '
                        : 'font-inter text-body-medium'
                    }
                  >
                    {profileData.email}
                  </p>
                </div>
                <div className="flex items-center mt-4">
                  <p
                    className={
                      isDarkMode
                        ? 'font-inter text-slate-400'
                        : 'font-inter text-body-medium'
                    }
                  >
                    General
                  </p>
                  <div className="flex items-center align-middle ml-8">
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                    <p
                      className={
                        isDarkMode
                          ? 'font-inter text-slate-400 ml-2'
                          : 'font-inter text-body-medium ml-2'
                      }
                    >
                      (5.0)
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end">
                {userId == pUserId && (
                  <Button
                    onClick={() =>
                      document.getElementById('edit_profile_modal').showModal()
                    }
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between w-full mt-8">
              <h1
                className={
                  isDarkMode
                    ? 'text-gray-200 font-inter font-bold text-heading-s pb-6'
                    : 'text-header-dark font-inter font-bold text-heading-s pb-6'
                }
              >
                About Me
              </h1>
              <p
                className={
                  isDarkMode
                    ? 'text-slate-400 font-inter'
                    : 'text-body-medium font-inter'
                }
              >
                {profileData.description || 'No description provided.'}
              </p>
            </div>
            <InterestsSection
              categories={profileData.favoriteEventCategories}
            />
          </div>
        </div>
        <div
          className={
            isDarkMode
              ? 'bg-slate-900 w-full h-auto p-8 mt-8 rounded-2xl shadow-md'
              : 'bg-white w-full h-auto p-8 mt-8 rounded-2xl shadow-md'
          }
        >
          <CommentSection
            contextId={userId}
            endpoint={'/users/' + pUserId + '/comments'}
            editPoint={'/users/comments/'}
          />
        </div>
      </div>
    </div>
  );
};
export default Profile;
