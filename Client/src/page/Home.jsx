import { useNavigate } from 'react-router';
import boardgamesIcon from '../assets/Boardgames-category.svg';
import Outdoor from '../assets/categories/outdoor.svg';
import musicIcon from '../assets/music-category.svg';
import SportsIcon from '../assets/sports-category.svg';
import { useAuth } from '../components/Auth/AuthContext';
import CategoryButton from '../components/CategoryButton';
import EventCarousel from '../components/EventCarousel';
import HeroSection from '../components/HeroSection';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCategoryClick = category => {
    navigate(`/events?category=${encodeURIComponent(category.toLowerCase())}`);
  };

  return (
    <div>
      <HeroSection />
      <div
        id="categories-section"
        className="flex flex-col items-center justify-between py-16 px-20 gap-y-12 w-full bg-white"
      >
        <h1 className="text-heading-l text-header-dark font-bold flex flex-col ">
          Explore Events By Category
        </h1>

        <div className="flex gap-x-6 gap-y-6 tablet:gap-y-0 flex-col items-center tablet:flex-row justify-center">
          <CategoryButton
            text={'Music'}
            picture={musicIcon}
            onClick={() => handleCategoryClick('Music')}
          />
          <CategoryButton
            text={'Sports'}
            picture={SportsIcon}
            onClick={() => handleCategoryClick('Sports')}
          />
          <CategoryButton
            text={'Outdoor'}
            picture={Outdoor}
            onClick={() => handleCategoryClick('Outdoor')}
          />
          <CategoryButton
            text={'Board Games'}
            picture={boardgamesIcon}
            onClick={() => handleCategoryClick('Boardgames')}
          />
        </div>
      </div>
      {isAuthenticated && (
        <EventCarousel
          fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/recommended`}
          title={'Recommended for You'}
        />
      )}

      {/* <EventCarousel2
        fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/upcoming`}
      /> */}

      {!isAuthenticated && (
        <EventCarousel
          fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/hot`}
          title={'Hot events'}
          needAuthorization={true}
        />
      )}

      {/* <EventCarousel
        fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/upcoming`}
        title={'Recommended for You'}
      /> */}
    </div>
  );
};
export default Home;
