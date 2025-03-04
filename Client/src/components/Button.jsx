const Button = ({
  children,
  onClick,
  type = "button",
  styleType = "primary",
  size = "medium",
  background="bg-btn",
  textColor="text-white",
  hoverColor="hover:bg-btn-hover"
}) => {
  const sizes = {
    big: "h-[3.5rem] px-8",
    medium: "h-[2.5rem] px-4",
    small: "h-[2rem] px-2",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${textColor} ${sizes[size]} ${background} text-4 not-italic font-[400] rounded-[0.5rem] btn btn-soft ${hoverColor} hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-0 `}
    >
      {children}
    </button>
  );
};

export default Button;