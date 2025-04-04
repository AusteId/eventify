import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import EventCard2 from './EventCard2';
import LoadingSection from './LoadingSection';

const EventCarousel2 = props => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    touchMove: true,
    centerMode: true,
    centerPadding: '80px',
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  };

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
        const response = await api.get(props.fetchUrl);
        setData(response.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props.fetchUrl]);

  if (loading) {
    return <LoadingSection />;
  }

  return (
    <div className="slider-container overflow-clip pb-15 bg-white">
      <Slider {...settings}>
        {data.map(event => (
          <EventCard2 event={event} />
        ))}
      </Slider>
    </div>
  );
};

export default EventCarousel2;
