import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDarkMode } from './context/DarkModeContext.jsx';

const ScrollChevron = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isBouncing, setIsBouncing] = useState(true);
  const { isDarkMode } = useDarkMode();

  const { ref } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    const bounceTimer = setTimeout(() => {
      setIsBouncing(false);
    }, 2530); // Bounce for 6 seconds (3 animations of 2 seconds each)

    return () => clearTimeout(bounceTimer);
  }, []);

  // Hide chevron when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategories = () => {
    document.getElementById('categories-section').scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 transition-opacity duration-300  ${
        !isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      ref={ref}
    >
      <button
        onClick={scrollToCategories}
        className={`cursor-pointer duration-750 ${isDarkMode ? "bg-slate-900 hover:bg-slate-600 border-1 border-[#f59e0b]" : "hover:bg-white bg-white/80"} backdrop-blur-sm p-3 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.2)] transition-all ${isBouncing ? 'animate-bounce' : ''}`}
        aria-label="Scroll down"
      >
        <ChevronDown className={`${isDarkMode ? "text-[#f59e0b]" : "text-black"}`} size={24} />
      </button>
    </div>
  );
};

export default ScrollChevron;
