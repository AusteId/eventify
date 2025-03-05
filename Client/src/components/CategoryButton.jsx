const CategoryButton = ({
  children,
  onClick,
  type = 'button',
  styleType = 'primary',
  size = 'big',
  background = 'bg-[#FEFCE8]',
  textColor = 'text-white',
  picture,
  text
}) => {
  const sizes = {
    big: 'h-[6.75rem] w-[18.375rem]',
    medium: 'h-[5.5rem] w-[12rem]',
    small: 'h-[4.5rem] w-[8rem]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${textColor} px-4 ${background} ${sizes[size]} text-4 not-italic font-[400] rounded-[0.5rem] btn btn-soft hover:bg-[#fcf6b7] hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-0 desktop:h-[6.75rem] desktop:w-[18.375rem] tablet:h-[5.5rem] tablet:w-[11rem] h-[6.75rem] w-[18.375rem]`}
    >
      <div className="text-black font-[600] flex flex-col items-center">
        <img src={picture} alt="music Icon" />
        <p className="mb-[0.25rem]">{text}</p>
      </div>
    </button>
  );
};

export default CategoryButton;
