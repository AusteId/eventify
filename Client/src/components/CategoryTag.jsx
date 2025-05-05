import { useDarkMode } from '../components/context/DarkModeContext';
const CategoryTag = props => {
  const cText = props.text.charAt(0).toUpperCase() + props.text.slice(1);
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={
        isDarkMode
          ? 'flex items-center text-btn font-inter font-medium h-9 bg-slate-600 px-4 py-2 rounded-full'
          : 'flex items-center text-category-title font-inter font-medium h-9 bg-category-bg px-4 py-2 rounded-full'
      }
    >
      <img src={props.img} alt="" />
      <p className="pl-2">{cText}</p>
    </div>
  );
};

export default CategoryTag;
