import React from 'react';

const OrganizerCard = ({ image, title, rating, description, isDarkMode }) => {
  return (
    <div className="">
      <div
        className={`h-31 @apply w-[18.375rem] flex-col justify-center shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10),0px_4px_6px_0px_rgba(0,0,0,0.10)] p-4 rounded-xl border-0 border-solid;
        ${isDarkMode ? 'bg-slate-900 border-1 border-[#f59e0b] hover:bg-slate-600' : 'border-transparent  bg-[#FEFCE8]'}; duration-750 flex`}
      >
        <div className="flex w-full">
          <div className=" bg-gray-300 flex flex-row mb-2 w-12 h-12 rounded-full object-cover gap-3">
            <img
              className="flex flex-row bg-gray-300 rounded-full"
              src={image}
            />
            <div className="gap-y-2 flex flex-col justify-start">
              <h3
                className={`whitespace-nowrap @apply duration-750 ${isDarkMode ? 'text-btn' : 'text-black'} text-base not-italic font-bold leading-4 flex font-family: Inter;`}
              >
                {title}
              </h3>

              <span className="gap-1 text-sm flex">
                {' '}
                <svg
                  className={`w-4 h-4 text-yellow-400 `}
                  fill={`currentColor`}
                  viewBox=" 0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.839-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.314 9.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
                <div
                  className={` duration-750 ${isDarkMode ? 'text-gray-200' : 'text-yellow-400'}`}
                >
                  {rating}
                </div>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full flex-col pb-1"></div>

        <p
          className={`text-sm flex duration-750 ${isDarkMode ? 'text-gray-200' : 'text-gray-600/70'} `}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default OrganizerCard;
