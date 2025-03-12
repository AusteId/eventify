import InterestsSection from '../components/InterestsSection';
import CommentSection from '../components/CommentSection';
const Profile = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-t from-[#FFFFFF] via-gradient-light-yellow to-gradient-yellow">
      <div className="tablet:w-224 mx-auto">
        <div className="bg-[#FFFFFF] w-full h-auto p-8 mt-8 rounded-4 shadow-md">
          <div className="size-full">
            <div className="flex w-full h-32">
              <img
                className="w-32 h-32 rounded-full"
                src="src/assets/avatar.png"
                alt="Avatar"
              />
              <div className="ml-8">
                <div className="flex items-center">
                  <h1 className="text-header-dark font-inter font-bold text-heading-m">
                    Sarah Mitchell
                  </h1>
                  <p className="text-[#6B7280] font-inter items-baseline ml-3">
                    28
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="font-inter text-body-medium">
                    sarah.mitchell@gmail.com
                  </p>
                </div>
                <div className="flex items-center mt-4">
                  <p className="font-inter text-body-medium">General</p>
                  <div className="flex items-center align-middle ml-15">
                    <img className="" src="src/assets/star.svg" alt="Star" />
                    <img className="" src="src/assets/star.svg" alt="Star" />
                    <img className="" src="src/assets/star.svg" alt="Star" />
                    <img className="" src="src/assets/star.svg" alt="Star" />
                    <img className="" src="src/assets/star.svg" alt="Star" />
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
                Adventure enthusiast and social butterfly! I love organizing
                group activities and meeting new people. Always up for trying
                new experiences and creating memorable moments with fellow
                event-goers.
              </p>
            </div>
            <InterestsSection />
          </div>
        </div>
        <div className="bg-[#FFFFFF] w-full h-auto p-[32px] mt-[32px] rounded-[16px] shadow-md">
          <CommentSection />
        </div>
      </div>
    </div>
  );
};
export default Profile;
