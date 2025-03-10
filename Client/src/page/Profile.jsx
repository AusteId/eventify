import InterestsSection from '../components/InterestsSection';
import CommentSection from '../components/CommentSection';
const Profile = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-t from-[#FFFFFF] via-gradient-light-yellow to-gradient-yellow">
      <div className="desktop:w-[896px] tablet:w-[896px] mx-auto">
        <div className="bg-[#FFFFFF] w-full h-auto p-[32px] mt-[32px] rounded-[16px] shadow-md">
          <div className="size-full">
            <div className="flex w-full h-[128px]">
              <img
                className="w-[128px] h-[128px] rounded-full"
                src="src/assets/avatar.png"
                alt="Avatar"
              />
              <div className="ml-[32px]">
                <div className="flex items-center">
                  <h1 className="text-header-dark font-inter font-bold text-heading-m">
                    Sarah Mitchell
                  </h1>
                  <p className="text-[#6B7280] font-inter items-baseline ml-[12px]">
                    28
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="font-inter text-body-medium">
                    sarah.mitchell@gmail.com
                  </p>
                </div>
                <div className="flex items-center mt-[16px]">
                  <p className="font-inter text-body-medium">General</p>
                  <div className="flex items-center align-middle ml-[60px]">
                    <img className="" src="src/assets/star.svg" alt="Star" />
                    <img className="" src="src/assets/star.svg" alt="Star" />
                    <img className="" src="src/assets/star.svg" alt="Star" />
                    <img className="" src="src/assets/star.svg" alt="Star" />
                    <img className="" src="src/assets/star.svg" alt="Star" />
                  </div>
                  <p className="font-inter text-body-medium ml-[16px]">(5.0)</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between w-full mt-[32px]">
              <h1 className="text-header-dark font-inter font-bold text-heading-s pb-[23px]">
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
