import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useOutletContext } from 'react-router';
import { useFormContext } from 'react-hook-form';
import Button from '../Button';

const RegistrationThirdStep = forwardRef((props, ref) => {
  const { prevStep, nextStep, skipStep } = useOutletContext();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  RegistrationThirdStep.displayName = "RegistrationThirdStep";

  const {
    register,
    formState: { errors },
    setValue,
    watch
  } = useFormContext();

  const categoryIds = watch("categoryIds") || [];

  useEffect(() => {
    if (categoryIds.length > 0) {
      setSelectedInterests(categoryIds);
    }
  },[])

  const getAllCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/categories/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const toggleInterest = (interestId) => {
    let newInterests;
    if (selectedInterests.includes(interestId)) {
      newInterests = selectedInterests.filter(id => id !== interestId);
    } else {
      newInterests = [...selectedInterests, interestId];
    }
    
    setSelectedInterests(newInterests);
    setValue("categoryIds", newInterests);
  };
  
  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      return true;
    }
  }));

  register("categoryIds")

  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-header-dark text-heading-l font-[700]">
        Your Interests
      </h2>
      <p className="text-body-m text-body-medium">
        Select the types of events you're interested in (optional)
      </p>

      {isLoading ? (
        <div className="text-center py-4">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-4">No categories available</div>
      ) : (
        <div className="flex flex-wrap gap-3 my-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`capitalize
                cursor-pointer px-4 py-2 rounded-full border
                ${selectedInterests.includes(category.id) 
                  ? 'bg-btn text-white border-btn' 
                  : 'bg-white text-body-medium border-gray-300'}
              `}
              onClick={() => toggleInterest(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>
      )}
      
      <section className="flex justify-between w-[100%] mt-6">
        <section>
          <Button
            background="bg-white"
            textColor="text-btn"
            border="border border-btn"
            onClick={prevStep}
          >
            Back
          </Button>
        </section>
        <section>
          <Button
            background="bg-white"
            textColor="text-btn"
            hoverColor="hover:bg-gray-50"
            onClick={skipStep} 
          >
            Skip
          </Button>
        </section>
        <section>
          <Button onClick={nextStep}>
            Next
          </Button>
        </section>
      </section>
    </div>
  );
});

export default RegistrationThirdStep;