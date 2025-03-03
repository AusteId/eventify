const Button = ({
    children,
    onClick,
    type = "button",
    styleType = "primary",
    size = "medium",
  }) => {
    const sizes = {
      medium: "h-[3rem] px-4",
      small: "h-[2rem] px-2",
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        className={`text-[#FFFFFF] bg-btn text-body-m not-italic font-[400] font-inter rounded-[0.5rem] btn btn-soft hover:bg-btn-hover hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] `}
      >
        {children}
      </button>
    );
  };
  
  export default Button;