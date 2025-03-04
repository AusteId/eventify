const Button = ({
  children,
  onClick,
  type = "button",
  styleType = "primary",
  size = "medium",
  background="bg-btn",
  textColor="text-white"
}) => {
  const sizes = {
    medium: "h-[3rem] px-4",
    small: "h-[2rem] px-2",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${textColor} px-4 ${background} text-4 not-italic font-[400] rounded-[0.5rem] btn btn-soft hover:bg-btn-hover hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-0 `}
    >
      {children}
    </button>
  );
};

export default Button;