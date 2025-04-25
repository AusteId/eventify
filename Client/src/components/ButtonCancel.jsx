import { useDarkMode } from './context/DarkModeContext.jsx';

const ButtonCancel = ({
  children,
  onClick,
  type = 'button',
  isFull = false,
  styleType = 'primary',
  size = 'medium',
  hoverColor,
}) => {
  const sizes = {
    medium: 'h-[3rem] px-4',
    small: 'h-[2rem] px-2',
  };

  const {isDarkMode} = useDarkMode();

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${isFull ? 'w-full ' : ' '} ${isDarkMode ? "duration-750, bg-slate-600 text-gray-200 hover:bg-slate-700" : "text-[#EF4444] duration-200"}  border-0  text-[1rem] not-italic font-[400] rounded-[0.5rem] btn btn-soft hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]`}
    >
      {children}
    </button>
  );
};

export default ButtonCancel;
