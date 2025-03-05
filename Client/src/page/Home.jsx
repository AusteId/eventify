import heroBanner from '../assets/HeroBanner.png';
import Button from '../components/button';
import boardgamesIcon from '../assets/Boardgames-category.svg';
import musicIcon from '../assets/music-category.svg';
import WorkshopIcon from '../assets/workshop-category.svg';
import SportsIcon from '../assets/sports-category.svg';
import CategoryButton from '../components/CategoryButton';

const Home = () => {
  return (
    <div>
      <div className="relative w-full h-150">
        <section
          className="absolute w-full h-full bg-cover bg-bottom"
          style={{ backgroundImage: `url(${heroBanner})` }}
        ></section>

        <section className="bg-black/50 w-full h-full absolute">
          <div className="mx-20 max-w-168 flex flex-col gap-8">
            <h1 className="text-white min-w-140 text-heading-xl mt-48 font-[700]">
              Connect, Create, Celebrate
            </h1>
            <p className="text-white min-w-96 text-heading-s/tight font-[400]">
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

      <div className="flex flex-col items-center justify-between py-16 px-20 gap-y-12 w-full bg-white">
        <h1 className="text-heading-l text-black font-[700] flex flex-col ">
          Explore Events By Category
        </h1>

        <div className="flex gap-x-6 gap-y-6 tablet:gap-y-0 flex-col items-center tablet:flex-row justify-center">
          <CategoryButton text={"Music"} picture={musicIcon}/>
          <CategoryButton text={"Sports"} picture={SportsIcon}/>
          <CategoryButton text={"Workshop"} picture={WorkshopIcon}/>
          <CategoryButton text={"Board Games"} picture={boardgamesIcon}/>
        </div>
      </div>

      <div className="flex flex-col px-24 justify-center bg-light-gray">
        <h2 className="text-heading-m mt-8 mb-6">Recommended for You</h2>
        <p className="text-center">--------KORTELIU PLACEHOLDER---------</p>
      </div>
    </div>
  );
};
export default Home;
