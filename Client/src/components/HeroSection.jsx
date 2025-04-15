import React from 'react';
import { useNavigate } from 'react-router';
import heroBanner from '../assets/hero.jpg';
import { useAuth } from '../components/Auth/AuthContext';
import ScrollChevron from '../components/ScrollChevron';
import Button from './Button';
import { useNotifications } from './context/NotificationContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {isDarkMode} = useNotifications();

  return (
    <div className="relative min-h-200 h-[calc(100vh-64px)] w-full">
      <section
        className="absolute w-full h-full bg-cover bg-bottom"
        style={{ backgroundImage: `url(${heroBanner})` }}
      ></section>
      <section className="bg-black/50 w-full h-full absolute content-center text-center">
        <div className={`flex flex-col items-center duration-750 ${isDarkMode ? "text-gray-200" : "text-white"}`}>
          <h1 className={`min-w-140 text-heading-xxl font-[700]`}>
            Connect, Create, Celebrate
          </h1>
          <p className="min-w-96 text-heading-s/tight font-[400] mt-4">
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
              background={`duration-750 ${isDarkMode ? "bg-slate-900 border-1 border-[#f59e0b] hover:bg-slate-600" : "bg-white"}`}
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
      </section>
    </div>
  );
};

export default HeroSection;
