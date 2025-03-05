import CategoryTag from '../components/CategoryTag';
import ProfileComment from '../components/ProfileComment';
const Profile = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-t from-gradient-white via-gradient-light-yellow to-gradient-yellow">
      <div className="w-[896px] mx-auto">
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
                <div className="flex items-center mt-[8px]">
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
            <div className="w-full mt-[32px]">
              <h1 className="text-header-dark font-inter font-bold text-heading-s">
                Interests
              </h1>
              <div className="flex flex-wrap items-center pt-[16px] gap-[8px]">
                <CategoryTag
                  img="src/assets/categories/music.svg"
                  text="Music"
                />
                <CategoryTag
                  img="src/assets/categories/sports.svg"
                  text="Sports"
                />
                <CategoryTag
                  img="src/assets/categories/bgames.svg"
                  text="Board Games"
                />
                <CategoryTag
                  img="src/assets/categories/food.svg"
                  text="Food & Dining"
                />
                <CategoryTag
                  img="src/assets/categories/photo.svg"
                  text="Photography"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#FFFFFF] w-full h-auto p-[32px] mt-[32px] rounded-[16px] shadow-md">
          <h1 className="text-header-dark font-inter font-bold text-heading-s pb-[23px]">
            Comments
          </h1>
          <div className="flex">
            <img
              className="w-[40px] h-[40px] rounded-full"
              src="src/assets/avatar.png"
              alt=""
            />
            <div className="pl-[16px] w-full">
              <textarea
                class="field-sizing-fixed resize-none font-inter text-body-medium text-body-m w-full bg-transparent placeholder:text-slate-400 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none ..."
                rows="4"
                placeholder="Write a comment..."
              ></textarea>
              <button className="btn bg-btn outline-none hover:bg-btn-hover px-[16px] pt-[10px] pb-[10px] rounded-[8px]">
                Post Comment
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-[24px] pt-[32px]">
            <ProfileComment
              name="Mike Johnson"
              avatar="src/assets/avatar.png"
              comment="Great event organizer! Really enjoyed the board game night last week."
              time="2 days ago"
            />
            <ProfileComment
              name="John Johnson"
              avatar="src/assets/avatar.png"
              comment="This guy is an amazing host!"
              time="7 days ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
