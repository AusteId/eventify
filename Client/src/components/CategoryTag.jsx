const CategoryTag = (props) => {
  const cText = props.text.charAt(0).toUpperCase() + props.text.slice(1);
  return (
    <div className="flex items-center text-category-title font-inter font-medium h-9 bg-category-bg px-4 py-2 rounded-full">
        <img src={props.img} alt="" />
        <p className="pl-2">{cText}</p>
    </div>
  )
}

export default CategoryTag