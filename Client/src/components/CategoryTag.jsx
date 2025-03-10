const CategoryTag = (props) => {
  return (
    <div className="flex items-center text-category-title font-inter font-medium h-[36px] bg-category-bg px-[16px] pt-[10px] pb-[10px] rounded-full">
        <img src={props.img} alt="" />
        <p className="pl-[8px]">{props.text}</p>
    </div>
  )
}

export default CategoryTag