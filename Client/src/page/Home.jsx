import { useNavigate } from 'react-router';
import boardgamesIcon from '../assets/Boardgames-category.svg';
import Outdoor from '../assets/categories/outdoor.svg';
import musicIcon from '../assets/music-category.svg';
import SportsIcon from '../assets/sports-category.svg';
import { useAuth } from '../components/Auth/AuthContext';
import CategoryButton from '../components/CategoryButton';
import EventCarousel from '../components/EventCarousel';
import HeroSection from '../components/HeroSection';
import { useNotifications } from '../components/context/NotificationContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useNotifications(); 

  const handleCategoryClick = category => {
    navigate(`/events?category=${encodeURIComponent(category.toLowerCase())}`);
  };

  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 bg-gradient-to-t from-white via-gradient-light-yellow to-gradient-yellow transition-opacity duration-750"
        style={{ opacity: isDarkMode ? 0 : 1 }}
      />
      
      <div 
        className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-amber-900 transition-opacity duration-750"
        style={{ opacity: isDarkMode ? 1 : 0 }}
      />
      
      <div className="relative z-10">
        <HeroSection />
        <div
          id="categories-section"
          className={`flex flex-col items-center justify-between py-16 px-20 gap-y-12 w-full transition-colors duration-750 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-header-dark'
          }`}
        >
          <h1 className={`text-heading-l font-bold flex flex-col ${
            isDarkMode ? 'text-gray-200' : 'text-header-dark'
          }`}>
            Explore Events By Category
          </h1>

          <div className={`flex gap-x-6 gap-y-6 tablet:gap-y-0 flex-col items-center tablet:flex-row justify-center`}>
            <CategoryButton
              text={'Music'}
              textColor={`duration-750 ${isDarkMode ? "text-[#f59e0b]" : "text-black"}`}
              picture={musicIcon}
              background={`duration-750 ${isDarkMode ? "bg-slate-900 border-1 border-[#f59e0b] hover:bg-slate-600" : "bg-[#FEFCE8]"}`}
              onClick={() => handleCategoryClick('Music')}
            />
            <CategoryButton
              text={'Sports'}
              background={`duration-750 ${isDarkMode ? "bg-slate-900 border-1 border-[#f59e0b] hover:bg-slate-600" : "bg-[#FEFCE8]"}`}
              textColor={`duration-750 ${isDarkMode ? "text-[#f59e0b]" : "text-black"}`}
              picture={SportsIcon}
              onClick={() => handleCategoryClick('Sports')}
            />
            <CategoryButton
              text={'Outdoor'}
              background={`duration-750 ${isDarkMode ? "bg-slate-900 border-1 border-[#f59e0b] hover:bg-slate-600" : "bg-[#FEFCE8]"}`}
              textColor={`duration-750 ${isDarkMode ? "text-[#f59e0b]" : "text-black"}`}
              picture={Outdoor}
              onClick={() => handleCategoryClick('Outdoor')}
            />
            <CategoryButton
              text={'Board Games'}
              background={`duration-750 ${isDarkMode ? "bg-slate-900 border-1 border-[#f59e0b] hover:bg-slate-600" : "bg-[#FEFCE8]"}`}
              textColor={`duration-750 ${isDarkMode ? "text-[#f59e0b]" : "text-black"}`}
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
        {!isAuthenticated && (
          <EventCarousel
            fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/hot`}
            title={'Hot events'}
            needAuthorization={true}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
