const SubmitButton = ({
  children,
  onClick,
  type = 'submit',
  isFull = false,
  size = 'h-[2.5rem] px-4',
  background = 'bg-btn',
  textColor = 'text-white',
  hoverColor = 'hover:bg-btn-hover',
}) => {


  return (
    <button
      type={type}
      onClick={onClick}
      className={`${isFull ? 'w-full ' : ''} ${textColor} ${size} ${background} text-4 not-italic font-[400] rounded-[0.5rem] btn btn-soft ${hoverColor} hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-0 `}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
