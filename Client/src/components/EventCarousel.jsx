import { useCallback, useEffect, useMemo, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import axios from 'axios';
import { staticEventLoader } from '../helpers/staticEventLoader';
import EventCard from './EventCard';
import { CarouselButton } from './CarouselButton';

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

export default function EventCarousel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [slider, setSlider] = useState(null);

  // TODO: fetch only required amount, current setup inefficient
  // fetching data:
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_URL}/api/events`,
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // },
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setData(staticEventLoader());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // cutting slicing the fetched data,
  const currentEvents = useMemo(() => {
    const events = Array.isArray(data) ? data : [];
    return events.slice(0, 10);
  }, [data]);

  // setting of carousel. more:
  // https://react-slick.neostack.com/docs/api

  // FIXME: scrolls too fast back to beginning, might need to tweak index.css file
  var settings = useMemo(
    () => ({
      dots: true,
      swipeToSlide: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slide: 'div',
      touchMove: true,
      slidesToScroll: 1,
      autoplay: true,
      draggable: true,
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
            slidesToShow: 2,
          },
        },
      ],
    }),
    [],
  );

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
    <div className="w-full mx-auto overflow-hidden mb-26 relative z-20">
      <CarouselButton
        onPrevClick={() => slider?.slickPrev()}
        onNextClick={() => slider?.slickNext()}
      />
      <Slider {...settings} ref={slider => setSlider(slider)}>
        {currentEvents.length > 0 ? (
          currentEvents.map((event, index) => (
            <div key={event.id || index} className="px-2 flex justify-center">
              <EventCard {...event} />
            </div>
          ))
        ) : (
          <div className="text-center py-4">No events available.</div>
        )}
      </Slider>
    </div>
  );
}
