import React, { useState } from 'react';


const CustomCheckbox = ({
  svgIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      className="fill-current"
    >
      <g clipPath="url(#clip0_82_1633)">
        <path
          d="M4.3875 3L8.38125 6.99375C9.44531 5.70469 10.0781 4.05 10.0781 2.25C10.0781 1.56094 9.98438 0.895312 9.81094 0.2625C7.7625 0.703125 5.90625 1.66406 4.3875 3ZM3.32812 4.05937C1.99219 5.57812 1.03125 7.43438 0.590625 9.48281C1.22344 9.65625 1.88906 9.75 2.57812 9.75C4.37813 9.75 6.03281 9.11719 7.32656 8.05781L3.32812 4.05937ZM12.3281 0C11.9859 0 11.6438 0.0140625 11.3062 0.0421875C11.4844 0.75 11.5781 1.49062 11.5781 2.25C11.5781 4.46719 10.7766 6.49219 9.45 8.0625L12.3281 10.9406L20.2687 3C18.15 1.13438 15.3703 0 12.3281 0ZM2.57812 11.25C1.81875 11.25 1.07812 11.1562 0.370312 10.9781C0.342187 11.3156 0.328125 11.6578 0.328125 12C0.328125 15.0422 1.4625 17.8219 3.32812 19.9406L11.2687 12L8.39062 9.12188C6.82031 10.4484 4.79531 11.25 2.57812 11.25ZM24.2859 13.0219C24.3141 12.6844 24.3281 12.3422 24.3281 12C24.3281 8.95781 23.1938 6.17812 21.3281 4.05937L13.3875 12L16.2656 14.8781C17.8312 13.5516 19.8609 12.75 22.0781 12.75C22.8375 12.75 23.5781 12.8437 24.2859 13.0219ZM24.0656 14.5172C23.4328 14.3438 22.7672 14.25 22.0781 14.25C20.2781 14.25 18.6234 14.8828 17.3297 15.9422L21.3281 19.9406C22.6641 18.4266 23.6297 16.5703 24.0656 14.5172ZM16.2703 17.0016C15.2109 18.2953 14.5781 19.95 14.5781 21.75C14.5781 22.4391 14.6719 23.1047 14.8453 23.7375C16.8938 23.2969 18.75 22.3359 20.2687 21L16.275 17.0062L16.2703 17.0016ZM15.2062 15.9375L12.3281 13.0594L4.3875 21C6.50156 22.8656 9.28125 24 12.3281 24C12.6703 24 13.0125 23.9859 13.35 23.9578C13.1719 23.25 13.0781 22.5094 13.0781 21.75C13.0781 19.5328 13.8797 17.5078 15.2062 15.9375Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_82_1633">
          <path d="M0.328125 0H24.3281V24H0.328125V0Z" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  name = "Sports",
  checkedColor = "bg-btn",
  iconColorChecked = "text-white",
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label
      className={`flex flex-col items-center justify-center w-32 h-16 rounded-lg cursor-pointer transition-all duration-300 ${
        isChecked
          ? `${checkedColor} border-none`
          : 'bg-gray-100 border border-gray-200'
      }`}
    >
      <input
        type="checkbox"
        aria-label={`Toggle ${name}`}
        className="hidden"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      <div
        className={`w-6 h-6 ${isChecked ? 'text-white' : 'text-btn'}`}
      >
        {svgIcon}
      </div>
      <span
        className={`mt-1 text-body-m font[600] ${
          isChecked ? 'text-white' : 'text-header-dark'
        }`}
      >
        {name}
      </span>
    </label>
  );
};

export default CustomCheckbox;