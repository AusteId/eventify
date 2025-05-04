import { useDarkMode } from '../components/context/DarkModeContext';
import CategoryTag from './CategoryTag';

const InterestsSection = ({ categories }) => {
  console.log(categories);

  const { isDarkMode } = useDarkMode();

  return (
    <div className="w-full mt-8">
      <h1
        className={
          isDarkMode
            ? 'text-gray-200 font-inter font-bold text-heading-s'
            : 'text-header-dark font-inter font-bold text-heading-s'
        }
      >
        Interests
      </h1>
      {categories?.length != 0 ? (
        <div className="flex flex-wrap items-center pt-6 gap-2">
          {categories?.map(category => (
            <CategoryTag
              img={'data:image/png;base64,' + category.icon.data}
              text={category.name}
              key={category.id}
            />
          ))}
        </div>
      ) : (
        <p
          className={
            isDarkMode
              ? 'text-slate-400 font-inter pt-6'
              : 'text-body-medium font-inter pt-6'
          }
        >
          No interests provided.
        </p>
      )}
    </div>
  );
};

export default InterestsSection;
