import InterestsSection from '../components/InterestsSection';
import CommentSection from '../components/CommentSection';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import NotFound from './NotFound';
const Profile = () => {
  const [profileData, SetProfileData] = useState([])
  const [userFound, setUserFound] = useState(true)
  const {userId} = useParams()

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_URL}/api/users/${userId}`
        );
        console.log(response.data)
        SetProfileData(response.data)
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUserFound(false)
      }
    };
    getProfileData()
  }, [userId])

  if (!userFound) {
    return (
      <NotFound/>
    )
  }

  return (
    <div className="flex min-h-screen">
      <div className="tablet:w-224 mx-auto">
        <div className="bg-white w-full h-auto p-8 mt-8 rounded-2xl shadow-md">
          <div className="size-full">
            <div className="flex w-full h-32">
              <img
                className="w-32 h-32 rounded-full"
                src={`http://localhost:8080/api/users/${userId}/avatar`}
                alt="Avatar"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "../src/assets/avatar.png"
                }}
              />
              <div className="ml-8">
                <div className="flex items-center">
                  <h1 className="text-header-dark font-inter font-bold text-heading-m">
                    {profileData.username}
                  </h1>
                  <p className="text-[#6B7280] font-inter items-baseline ml-3">
                    28
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="font-inter text-body-medium">
                    {profileData.email}
                  </p>
                </div>
                <div className="flex items-center mt-4">
                  <p className="font-inter text-body-medium">General</p>
                  <div className="flex items-center align-middle ml-15">
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                    <img className="" src="../src/assets/star.svg" alt="Star" />
                  </div>
                  <p className="font-inter text-body-medium ml-4">(5.0)</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between w-full mt-8">
              <h1 className="text-header-dark font-inter font-bold text-heading-s pb-6">
                About Me
              </h1>
              <p className="text-body-medium font-inter">
                {profileData.description || "No description provided."}
              </p>
            </div>
            <InterestsSection categories={profileData.favoriteEventCategories} />
          </div>
        </div>
        <div className="bg-white w-full h-auto p-8 mt-8 rounded-2xl shadow-md">
          <CommentSection />
        </div>
      </div>
    </div>
  );
};
export default Profile;
