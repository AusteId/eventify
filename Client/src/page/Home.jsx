import heroBanner from '../assets/HeroBanner.png';
import Button from '../components/button';
import CategoryButton from '../components/CategoryButton';
import boardgamesIcon from '../assets/Boardgames-category.svg';
import musicIcon from '../assets/music-category.svg';
import WorkshopIcon from '../assets/workshop-category.svg';
import SportsIcon from '../assets/sports-category.svg';

const Home = () => {
  return (
    <div>
      <div className="relative w-full h-[37.5rem]">
        <section
          className="absolute w-full h-full bg-cover bg-bottom"
          style={{ backgroundImage: `url(${heroBanner})` }}
        ></section>
        <section className="bg-black/50 w-full h-full absolute">
          <div className="mx-20 w-[42rem] flex flex-col gap-8">
            <h1 className="text-white text-heading-xl mt-48 font-[700]">
              Connect, Create, Celebrate
            </h1>
            <p className="text-white text-heading-s/tight font-[400] text-wrap">
              Discover amazing events or create your own. Join a comminty of
              people who love to connect and share experiences.
            </p>
            <div className="flex gap-4">
              <Button size="big">Create Event</Button>
              <Button
                size="big"
                background="bg-white"
                textColor="text-btn"
                hoverColor="hover:bg-[#fcf6b7]"
              >
                Join Event
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col items-center justify-between py-16 px-20 gap-y-12 w-full ">
        <h1 className="text-heading-l text-black font-[700] flex flex-col ">
          Explore Events By Category
        </h1>

        <div className="flex gap-x-6 gap-y-6 tablet:gap-y-0 flex-col items-center tablet:flex-row justify-center">
          <CategoryButton>
            <div className="text-black font-[600] flex flex-col items-center">
              <img src={musicIcon} alt="music Icon" />
              <p className="mb-[0.25rem]">Music</p>
            </div>
          </CategoryButton>
          <CategoryButton>
            <div className="text-black font-[600] flex flex-col items-center">
              <img src={SportsIcon} alt="Sports Icon" />
              <p className="mb-[0.25rem]">Sports</p>
            </div>
          </CategoryButton>
          <CategoryButton>
            <div className="text-black font-[600] flex flex-col items-center">
              <img src={WorkshopIcon} alt="Workshop Icon" />
              <p className="mb-[0.25rem]">Music</p>
            </div>
          </CategoryButton>
          <CategoryButton>
            <div className="text-black font-[600] flex flex-col items-center">
              <img src={boardgamesIcon} alt="boardgames Icon" />
              <p className="mb-[0.25rem]">Board Games</p>
            </div>
          </CategoryButton>
        </div>
      </div>

      <div className="flex flex-col mx-24 justify-center">
        <h2 className="text-heading-m">Recommended for You</h2>
        <p className="text-center">--------KORTELIU PLACEHOLDER---------</p>
      </div>
    </div>
  );
};
export default Home;
