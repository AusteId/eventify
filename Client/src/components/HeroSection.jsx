import React from 'react';
import { useNavigate } from 'react-router';
import heroBanner from '../assets/hero.jpg';
import { useAuth } from '../components/Auth/AuthContext';
import ScrollChevron from '../components/ScrollChevron';
import Button from './Button';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <div className="relative min-h-200 h-screen w-full">
      <section
        className="absolute w-full h-full bg-cover bg-bottom"
        style={{ backgroundImage: `url(${heroBanner})` }}
      ></section>
      <section className="bg-black/50 w-full h-full absolute content-center text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-white min-w-140 text-heading-xxl font-[700]">
            Connect, Create, Celebrate
          </h1>
          <p className="text-white min-w-96 text-heading-s/tight font-[400] mt-4">
            Discover amazing events or create your own. Join a community of
            people who love to connect and share experiences.
          </p>
          <div className="flex gap-4 mt-16">
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
                if (isAuthenticated) {
                  navigate('/events');
                } else {
                  navigate('/login');
                }
              }}
            >
              Join Event
            </Button>
          </div>
          <ScrollChevron />
        </div>
        {/* <div className="absolute left-1/2 transform -translate-x-1/2 bottom-1/8 flex flex-col items-center">
          <button
            className="flex flex-col items-center justify-center text-white animate-bounce cursor-pointer focus:outline-none  rounded-full p-2"
            aria-label="Scroll down to explore events"
          >
            <span className="text-heading-s mb-1">Explore</span>
            <ChevronDown size={35} />
          </button>
        </div> */}
      </section>
    </div>
  );
};

export default HeroSection;
