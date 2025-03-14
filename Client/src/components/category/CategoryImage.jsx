import image from "../../assets/default-category-icon.png"

const CategoryImage = ({categoryId}) => {
    
    return ( 
        <>
        <img 
        src={`http://localhost:8080/api/categories/${categoryId}/icon`}
        alt="Category icon"
        className="w-6 h-6 "
        onError={(e) => {
            e.currentTarget.src = `${image}`
        }}
        />
        </>
     );
}
 
export default CategoryImage;