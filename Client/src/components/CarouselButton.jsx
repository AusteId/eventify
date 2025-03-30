import { ChevronLeft, ChevronRight } from "lucide-react";

export const CarouselButton = ({ onPrevClick, onNextClick, type = 'button' }) => {
  return (
    <div className="absolute z-10 w-full top-[calc(50%-3.5rem)] pointer-events-none">
      <div className="flex justify-between">
        <button
          type={type}
          onClick={onPrevClick}
          className={`text-black h-12 w-12 ml-8 hover:bg-[#F3E3C7] border-1 text-4 not-italic font-[400] rounded-full btn btn-soft  shadow-[0_3px_10px_rgba(0,0,0,0.2),_0_10px_15px_rgba(0,0,0,0.1)]  pointer-events-auto`}
        >
          <ChevronLeft />
        </button>
        <button
          type={type}
          onClick={onNextClick}
          className={`text-black h-12 w-12 mr-8 hover:bg-[#F3E3C7] border-1 text-4 not-italic font-[400] rounded-full btn btn-soft  shadow-[0_3px_10px_rgba(0,0,0,0.2),_0_10px_15px_rgba(0,0,0,0.1)] pointer-events-auto`}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CarouselButton;
