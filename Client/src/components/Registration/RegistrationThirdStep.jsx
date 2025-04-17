import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useOutletContext } from 'react-router';
import Button from '../Button';
import CategoryImage from '../category/CategoryImage';
import LoadingScreen from '../message/LoadingScreen';
import RegistrationSteps from '../RegistrationSteps';
import toast from 'react-hot-toast';

const RegistrationThirdStep = forwardRef((props, ref) => {
  const { prevStep, nextStep } = useOutletContext();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  RegistrationThirdStep.displayName = 'RegistrationThirdStep';

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const categoryIds = watch('categoryIds') || [];

  useEffect(() => {
    if (categoryIds.length > 0) {
      setSelectedInterests(categoryIds);
    }
  }, []);

  const getAllCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/categories/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast.error(`Error fetching categories: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const toggleInterest = interestId => {
    let newInterests;
    if (selectedInterests.includes(interestId)) {
      newInterests = selectedInterests.filter(id => id !== interestId);
    } else {
      newInterests = [...selectedInterests, interestId];
    }

    setSelectedInterests(newInterests);
    setValue('categoryIds', newInterests);
  };

  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      return true;
    },
  }));

  register('categoryIds');

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <RegistrationSteps step={3} />
      <div
        className={`flex flex-col gap-6 p-12  shadow-md rounded-2xl mt-12 duration-750 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
      >
        <h2
          className={` text-heading-l font-[700] flex justify-center duration-750 ${isDarkMode ? 'text-[#f59e0b]' : 'text-header-dark'}`}
        >
          What interests you?
        </h2>
        <p
          className={`text-body-m font-[400] flex justify-center duration-750 ${isDarkMode ? 'text-gray-200' : 'text-body-medium'}`}
        >
          Select categories that match your interests (optional)
        </p>

        {isLoading ? (
          <div
            className={`text-center py-4 ${isDarkMode ? 'text-gray-200' : 'text-body-medium'}`}
          >
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div
            className={`text-center py-4 ${isDarkMode ? 'text-gray-200' : 'text-body-medium'}`}
          >
            No categories available
          </div>
        ) : (
          <div className="grid md:grid-cols-3 grid-rows-3 text-center gap-3 pt-12">
            {categories.map(category => (
              <div
                key={category.id}
                className={`capitalize
                cursor-pointer duration-500 px-4 py-2 rounded-2xl border flex flex-col items-center
                ${
                  selectedInterests.includes(category.id) && isDarkMode
                    ? 'border-[#f59e0b] bg-slate-700 text-gray-200'
                    : isDarkMode
                      ? 'border-[#f59e0b] text-gray-200'
                      : selectedInterests.includes(category.id)
                        ? 'bg-category-bg text-black border-btn'
                        : 'bg-white text-body-medium border-gray-300'
                }
              `}
                onClick={() => toggleInterest(category.id)}
              >
                <CategoryImage categoryId={category.id} />
                {category.name}
              </div>
            ))}
          </div>
        )}
        <section className="flex justify-between w-[100%] pt-16 ">
          <section>
            <Button
              type="button"
              size="large"
              background={`duration-750 ${isDarkMode ? 'bg-slate-600 text-gray-200 hover:bg-slate-700 hover:text-[#f59e0b]' : 'bg-white '}`}
              border="border border-btn"
              textColor={`${isDarkMode ? '' : 'text-[#f59e0b]'}`}
              onClick={prevStep}
            >
              Back
            </Button>
          </section>
          <section>
            <Button background={`duration-750 ${isDarkMode ? "bg-amber-700" : "bg-btn"}`} size="large" onClick={nextStep}>
              Next
            </Button>
          </section>
        </section>
      </div>
    </div>
  );
});

export default RegistrationThirdStep;
