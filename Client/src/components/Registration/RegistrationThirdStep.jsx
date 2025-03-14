
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useOutletContext } from 'react-router';
import { useFormContext } from 'react-hook-form';
import Button from '../Button';
import CategoryImage from '../category/CategoryImage';
import { useNotification } from '../context/NotificationContext';
import LoadingScreen from '../message/LoadingScreen';

const RegistrationThirdStep = forwardRef((props, ref) => {
  const { prevStep, nextStep, skipStep } = useOutletContext();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {timeoutForError,url} = useNotification();

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
      const response = await fetch(`${url}/api/categories/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        timeoutForError(`Error fetching categories: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      timeoutForError(err.message || "Failed to fetch categories")
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
    <>
    {isLoading && <LoadingScreen/>}
    <div className="flex flex-col gap-6 p-12 bg-white shadow-md rounded-2xl mt-12">
      <h2 className="text-header-dark text-heading-l font-[700] flex justify-center">
        What interests you?
      </h2>
      <p className="text-body-m text-body-medium font-[400] flex justify-center">
        Select categories that match your interests (optional)
      </p>

      {isLoading ? (
        <div className="text-center py-4">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-4">No categories available</div>
      ) : (
        <div className="grid md:grid-cols-3 grid-rows-3 text-center gap-3 pt-12">
          {categories.map(category => (
            <div
              key={category.id}
              className={`capitalize
                cursor-pointer px-4 py-2 rounded-2xl border flex flex-col items-center
                ${
                  selectedInterests.includes(category.id)
                    ? 'bg-category-bg text-black border-btn'
                    : 'bg-white text-body-medium border-gray-300'
                }
              `}
              onClick={() => toggleInterest(category.id)}
            >
              <CategoryImage categoryId={category.id}/>
              {category.name}
            </div>
          ))}
        </div>
      )}
      <section className="flex justify-between w-[100%] pt-16 ">
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
          <Button onClick={nextStep}>Next</Button>
        </section>
      </section>
    </div>
    </>
  );
});

export default RegistrationThirdStep;
