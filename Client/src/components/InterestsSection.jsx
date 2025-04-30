import CategoryTag from './CategoryTag';

const InterestsSection = ({categories}) => {

  console.log(categories)

  return (
    <div className="w-full mt-8">
      <h1 className="text-header-dark font-inter font-bold text-heading-s">
        Interests
      </h1>
      {categories?.length != 0 ?
        <div className="flex flex-wrap items-center pt-6 gap-2">
        {categories?.map(category => (
          <CategoryTag
            img={"data:image/png;base64," + category.icon.data}
            text={category.name}
            key={category.id}
          />
        ))}
      </div> : <p className="text-body-medium font-inter pt-6">No interests provided.</p>
      }
    </div>
  );
};

export default InterestsSection;
