export const CarouselButton = ({ onPrevClick, onNextClick, type = 'button' }) => {
  return (
    <div className="absolute z-10 w-full top-[calc(50%-3.5rem)] pointer-events-none">
      <div className="flex justify-between">
        <button
          type={type}
          onClick={onPrevClick}
          className={`text-black hover:text-white h-14 ml-8 p-6 bg-[#F3E3C7] border-1 border-orange-200 text-4 not-italic font-[400] rounded-full btn btn-soft hover:bg-btn hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]  pointer-events-auto`}
        >
          &#60;
        </button>
        <button
          type={type}
          onClick={onNextClick}
          className={`text-black hover:text-white h-14 mr-8 p-6 bg-[#F3E3C7] border-1 border-orange-200 text-4 not-italic font-[400] rounded-full btn btn-soft hover:bg-btn hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]  pointer-events-auto`}
        >
          &#62;
        </button>
      </div>
    </div>
  );
};

export default CarouselButton;
