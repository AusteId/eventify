import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { CarouselButton } from './CarouselButton';
import EventCard from './EventCard';
import { useDarkMode } from './context/DarkModeContext.jsx';

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const BREAKPOINTS = {
  MOBILE: 764,
  TABLET: 1440,
  DEKSTOP: 2000,
};

export default function EventCarousel({
  fetchUrl,
  title,
  needAuthorization = false,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [slider, setSlider] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920,
  );

  const { isDarkMode } = useDarkMode();

  const cardsPerView = useMemo(() => {
    if (windowWidth < BREAKPOINTS.MOBILE) return 1;
    if (windowWidth < BREAKPOINTS.TABLET) return 2;
    if (windowWidth < BREAKPOINTS.DEKSTOP) return 3;
    return 5;
  }, [windowWidth]);

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACK_URL + '/api',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // sutvarkyt sita suda

        {/*⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡛⠛⠷⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡇⠀⠀⠀⠙⠻⣷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠟⠀⠀⠀⠀⠀⠀⠈⣹⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⣠⡴⠞⠉⠈⠻⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣿⡧⠤⠤⠶⠖⠋⠉⠀⠀⠀⠀⠀⢹⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⠞⠉⠀⠉⠙⠻⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⣀⣀⣀⠀⠀⠀⠀⢀⣠⡴⠞⠉⠀⢀⣀⣀⣀⠀⠀⠘⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣿⣆⣴⠟⠉⠉⠉⠛⢶⡖⠛⠉⠁⠀⠀⢠⡾⠋⠉⠈⠉⠻⣦⣰⣿⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣤⣾⠟⠋⡿⠁⢀⣾⣿⣷⣄⠈⢿⡀⠀⠀⠀⢠⡟⠀⢠⣾⣿⣷⡄⠘⣿⠉⠛⢿⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⣿⠏⠀⠀⢸⡇⠀⢸⣿⣿⣿⣿⠀⢸⡇⠀⠀⠀⢸⡇⠀⣿⣿⣿⣿⣧⠀⢹⡇⠀⠀⠙⣿⡆⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡏⠀⠀⠀⠘⣧⠀⠘⣿⣿⣿⡟⠀⣸⠇⠀⣀⣤⢾⣇⠀⠹⣿⣿⣿⠇⠀⣾⠁⠀⠀⠀⢸⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⣷⠀⠀⠀⠀⠹⣧⡀⠈⠉⠁⢀⣴⠿⠞⠋⠉⠀⠀⠻⣦⡀⠈⠉⠁⣠⡾⠃⠀⠀⠀⠀⣾⡏⠀⠀⠀⠀
⠀⠀⢀⣠⣶⠿⠛⠛⠛⠛⠛⠛⠉⠙⠛⠒⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠚⠛⠉⠀⠀⠀⠀⢀⡼⠿⢷⣦⣄⠀⠀
⠀⣠⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣟⠛⠛⠒⠶⠶⠶⠶⠶⠶⠶⠖⠚⠛⢛⡷⠀⠀⠀⣀⡴⠋⠀⠀⠀⠈⠻⣷⡄
⢰⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⣄⡀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡶⠛⢁⣠⡴⠞⠋⠀⠀⠀⠀⠀⠀⠀⠘⣿
⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠓⠶⠶⠦⠶⠶⣚⣫⡥⠶⠚⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿
⠈⢿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⡤⠴⠖⠚⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⡿⠃
⠀⠈⠛⣷⣦⣤⣤⣤⣤⣤⣤⣶⡶⠾⠿⠟⠿⠿⠿⠶⣶⣶⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣶⠶⠿⠛⠉⠀⠀*/}

        const response = await api.get(fetchUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchUrl]);

  const currentEvents = useMemo(() => {
    const events = Array.isArray(data) ? data : [];
    return events.slice(0, 10);
  }, [data]);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  // settings of carousel. more:
  // https://react-slick.neostack.com/docs/api
  const settings = useMemo(() => {
    const hasEnoughItems = currentEvents.length > cardsPerView;

    return {
      dots: hasEnoughItems,
      swipeToSlide: hasEnoughItems,
      infinite: hasEnoughItems,
      speed: 500,
      slidesToShow: Math.min(currentEvents.length, cardsPerView),
      slide: 'div',
      touchMove: hasEnoughItems,
      slidesToScroll: 1,
      autoplay: hasEnoughItems,
      draggable: hasEnoughItems,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 764,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 1440,
          settings: {
            slidesToShow: Math.min(2, currentEvents.length),
          },
        },
      ],
    };
  }, [currentEvents.length, cardsPerView]);

  const handleResize = useCallback(
    () =>
      debounce(() => {
        if (slider) {
          slider.slickGoTo(slider.innerSlider.state.currentSlide);
        }
      }, 500),
    [slider],
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }

  return (
    <div className={`w-full mx-auto overflow-hidden relative z-20 duration-750 ${isDarkMode ? "bg-gray-800 dark-mode-carousel" : "bg-white"}`}>
      <h2
        className={`text-heading-l font-bold text-center pb-12 ${isDarkMode ? "text-gray-200" : "text-header-dark"}`}
      >
        {title}
      </h2>

      <div className="w-full overflow-hidden h-130">
        {currentEvents.length > 0 ? (
          <>
            <div className="hidden tablet:block">
              {currentEvents.length > cardsPerView && (
                <CarouselButton
                  onPrevClick={() => slider?.slickPrev()}
                  onNextClick={() => slider?.slickNext()}
                />
              )}
            </div>
            {currentEvents.length <= cardsPerView ? (
              <div className="flex justify-center">
                {currentEvents.map(event => (
                  <div key={event.id} className="px-2 flex justify-center pb-8">
                    <EventCard {...event} />
                  </div>
                ))}
              </div>
            ) : (
              <Slider {...settings} ref={slider => setSlider(slider)}>
                {currentEvents.map(event => (
                  <div key={event.id} className="px-2 flex justify-center pb-8">
                    <EventCard {...event} />
                  </div>
                ))}
              </Slider>
            )}
          </>
        ) : (
          <div className={`text-center py-4 mt-8 font-[600] text-heading-s ${isDarkMode && "text-gray-200"}`}>
            No events available.
          </div>
        )}
      </div>
    </div>
  );
}
