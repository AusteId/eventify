import CategoryTag from './CategoryTag';

const InterestsSection = () => {
  const categories = [
    {
      id: 1,
      img: 'src/assets/categories/music.svg',
      text: 'Music',
    },
    {
      id: 2,
      img: 'src/assets/categories/sports.svg',
      text: 'Sports',
    },
    {
      id: 3,
      img: 'src/assets/categories/bgames.svg',
      text: 'Board Games',
    },
    {
      id: 4,
      img: 'src/assets/categories/food.svg',
      text: 'Food & Dining',
    },
    {
      id: 5,
      img: 'src/assets/categories/photo.svg',
      text: 'Photography',
    },
  ];
  return (
    <div className="w-full mt-[32px]">
      <h1 className="text-header-dark font-inter font-bold text-heading-s">
        Interests
      </h1>
      <div className="flex flex-wrap items-center pt-[16px] gap-[8px]">
        {categories.map(category => (
          <CategoryTag
            img={category.img}
            text={category.text}
            key={category.id}
          />
        ))}
      </div>
    </div>
  );
};

export default InterestsSection;
