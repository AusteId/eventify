import React from 'react';
import Slider from 'react-slick';
import EventCard2 from './EventCard2';

const EventCarousel2 = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <EventCard2 />
      </Slider>
    </div>
  );
};

export default EventCarousel2;
