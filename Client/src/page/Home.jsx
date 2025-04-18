import { useNavigate } from 'react-router';
import boardgamesIcon from '../assets/Boardgames-category.svg';
import Outdoor from '../assets/categories/outdoor.svg';
import musicIcon from '../assets/music-category.svg';
import SportsIcon from '../assets/sports-category.svg';
import { useAuth } from '../components/Auth/AuthContext';
import CategoryButton from '../components/CategoryButton';
import EventCarousel from '../components/EventCarousel';
import HeroSection from '../components/HeroSection';
import OrganizerCard from '../components/OrganizerCard';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const cards = [
    {
      image:
        'https://th.bing.com/th/id/R.3d5271def48f4fdb163015c4da4d6e16?rik=l%2bhuF9bJ%2bJJgkQ&riu=http%3a%2f%2fesct2019.storage.googleapis.com%2fwp-content%2fuploads%2f2020%2f01%2fwsi-imageoptim-tom.jpg%3fx80666&ehk=akLDM0Q0xk2sPaJZ76q%2fztoCrl%2fiNEmnEa6fZ%2fMYZiI%3d&risl=&pid=ImgRaw&r=0',
      title: 'Sports Club',
      rating: 4.8,
      description: 'Organizing sports events since 2020',
    },
    {
      image:
        'https://th.bing.com/th/id/R.5e6d445e63ce55041a8c5ad887717f58?rik=XXsZ8BSNCZHfDA&pid=ImgRaw&r=0',
      title: 'Art Gallery',
      rating: 4.7,
      description: 'Weekly art exhibitions and worksho...',
    },
    {
      image:
        'https://cdn.pixabay.com/photo/2023/12/02/10/40/ai-generated-8425436_640.jpg',
      title: 'Beach Party',
      rating: 4.7,
      description: 'Host of the most wild parties',
    },
    {
      image:
        'https://bgr.com/wp-content/uploads/2019/02/download-1.jpeg?resize=300',
      title: 'Movie night',
      rating: 4.5,
      description: 'Organizing events to relax with frien...',
    },
  ];

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

      <h1 className="items-center text-heading-l text-header-dark font-bold p-[14%] py-16  gap-y-12 w-full @apply flex flex-col justify-center gap-4 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10),0px_4px_6px_0px_rgba(0,0,0,0.10)]">
        <div className="pr-[45%] items-start">
          Events from Popular Organizers
        </div>
        <div className=" items-center flex flex-wrap justify-center gap-8">
          {cards.map((card, index) => (
            <OrganizerCard
              key={index}
              image={card?.image}
              title={card?.title}
              rating={card.rating}
              description={card.description}
            />
          ))}
        </div>
      </h1>
    </div>
  );
};
export default Home;
