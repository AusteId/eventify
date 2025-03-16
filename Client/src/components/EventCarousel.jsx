import React, { useCallback, useEffect, useState } from 'react';
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

  // temporary solution

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACK_URL}/api/events/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setData(staticEventLoader());
    } finally {
      setLoading(false);
    }
  };

  const events = Array.isArray(data) ? data : [];
  const currentEvents = events.slice(0, 10);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
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
  };

  const handleResize = useCallback(
    debounce(() => {
      if (slider) {
        slider.slickGoTo(slider.innerSlider.state.currentSlide);
      }
    }, 250),
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
    <div className="w-full mx-auto overflow-hidden mb-26 relative">
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
