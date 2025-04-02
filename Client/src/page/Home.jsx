import { useNavigate } from 'react-router';
import boardgamesIcon from '../assets/Boardgames-category.svg';
import musicIcon from '../assets/music-category.svg';
import SportsIcon from '../assets/sports-category.svg';
import WorkshopIcon from '../assets/workshop-category.svg';
import { useAuth } from '../components/Auth/AuthContext';
import CategoryButton from '../components/CategoryButton';
import EventCarousel from '../components/EventCarousel';
import HeroSection from '../components/HeroSection';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <HeroSection />
      <div
        id="categories-section"
        className="flex flex-col items-center justify-between py-16 px-20 gap-y-12 w-full bg-white"
      >
        <h1 className="text-heading-l text-black font-[700] flex flex-col ">
          Explore Events By Category
        </h1>

        <div className="flex gap-x-6 gap-y-6 tablet:gap-y-0 flex-col items-center tablet:flex-row justify-center">
          <CategoryButton text={'Music'} picture={musicIcon} />
          <CategoryButton text={'Sports'} picture={SportsIcon} />
          <CategoryButton text={'Workshop'} picture={WorkshopIcon} />
          <CategoryButton text={'Board Games'} picture={boardgamesIcon} />
        </div>
      </div>
      {isAuthenticated && (
        <EventCarousel
          fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/recommended`}
          title={'Recommended for You'}
        />
      )}

      <EventCarousel
        fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/upcoming`}
        title={'Upcoming events'}
        needAuthorization={true}
      />
      {/* <EventCarousel
        fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/upcoming`}
        title={"Recommended for You"}
      /> */}
    </div>
  );
};
export default Home;
