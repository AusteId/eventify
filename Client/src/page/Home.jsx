import { useNavigate } from 'react-router';
import boardgamesIcon from '../assets/Boardgames-category.svg';
import musicIcon from '../assets/music-category.svg';
import SportsIcon from '../assets/sports-category.svg';
import Outdoor from '../assets/categories/outdoor.svg';
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
      {/* <div className="relative w-full h-150">
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
              <Button
                onClick={() => {
                  if (isAuthenticated) {
                    document.getElementById('event_creation_modal').showModal();
                  } else {
                    navigate('/login');
                  }
                }}
                size="big"
              >
                Create Event
              </Button>
              <Button
                size="big"
                background="bg-white"
                textColor="text-btn"
                hoverColor="hover:bg-[#fcf6b7]"
                onClick={() => {
                  navigate('/events');
                }}
              >
                Join Event
              </Button>
            </div>
          </div>
        </section>
      </div> */}

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

      {!isAuthenticated && (
        <EventCarousel
          fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/hot`}
          title={'Hot events'}
          needAuthorization={true}
        />
      )}

      {/* <EventCarousel
        fetchUrl={`${import.meta.env.VITE_BACK_URL}/api/events/upcoming`}
        title={"Recommended for You"}
      /> */}
    </div>
  );
};
export default Home;
