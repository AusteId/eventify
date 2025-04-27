const Button = ({
  className,
  children,
  onClick,
  type = 'button',
  isFull = false,
  styleType = 'primary',
  size = 'medium',
  background = 'bg-btn',
  textColor,
  hoverColor = 'hover:bg-btn-hover',
  border = 'border-0',
}) => {
  const sizes = {
    big: 'h-[3.5rem] px-8',
    large: "h-[3rem] px-6",
    medium: 'h-[2.5rem] px-4',
    small: 'h-[2rem] px-2',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${isFull ? 'w-full ' : ''} ${className || ""} ${styleType} ${textColor || "text-white"} ${sizes[size]} ${background} ${border} text-4 not-italic font-[400] rounded-[0.5rem] btn btn-soft ${hoverColor} hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]  `}
    >
      {children}
    </button>
  );
};

export default Button;
