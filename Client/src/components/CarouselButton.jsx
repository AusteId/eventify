import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNotifications } from './context/NotificationContext';

export const CarouselButton = ({
  onPrevClick,
  onNextClick,
  type = 'button',
}) => {

  const {isDarkMode} = useNotifications();

  return (
    <div className="flex flex-col  justify-center bg-light-gray">
      <div className="absolute z-10 w-full top-[calc(50%-3.5rem)] pointer-events-none">
        <div className="flex justify-between">
          <button
            type={type}
            onClick={onPrevClick}
            className={`cursor-pointer duration-750 ${isDarkMode ? "bg-slate-900 hover:bg-slate-600 border-1 border-[#f59e0b]" : "hover:bg-white bg-white/80"} backdrop-blur-sm p-3 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.2)] transition-all pointer-events-auto ml-8`}
          >
            <ChevronLeft className={`${isDarkMode ? "text-[#f59e0b]" : "text-black"}`} />
          </button>
          <button
            type={type}
            onClick={onNextClick}
            className={`cursor-pointer duration-750 ${isDarkMode ? "bg-slate-900 hover:bg-slate-600 border-1 border-[#f59e0b]" : "hover:bg-white bg-white/80"} backdrop-blur-sm p-3 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.2)] transition-all pointer-events-auto mr-8`}
          >
            <ChevronRight className={`${isDarkMode ? "text-[#f59e0b]" : "text-black"}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselButton;
