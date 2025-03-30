import { forwardRef, useImperativeHandle, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useOutletContext } from 'react-router';
import Button from '../Button';
import FieldValidationError from '../FieldValidationError';

const RegistrationSecondStep = forwardRef((props, ref) => {
  const { nextStep, prevStep, skipStep } = useOutletContext();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cities = [
    'New York',
    'Los Angeles',
    'Kyoto',
    'Vilnius',
    'Arizon',
    'Paris',
    'Peking',
    'MiddleOfBumfuckNowhere',
  ];

  RegistrationSecondStep.displayName = 'RegistrationSecondStep';

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
    handleSubmit,
  } = useFormContext();

  const selectedCity = watch('city');

  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      const fieldsValid = await trigger(['birthDate', 'city']);
      return fieldsValid;
    },
  }));

  const selectCity = city => {
    setValue('city', city);
    setCityDropdownOpen(false);
  };

  const getTodayString = () => {
    const today = new Date();
    // Get year, month, and day
    const year = today.getFullYear();
    // getMonth() is 0-indexed, so add 1
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    // Format as YYYY-MM-DD
    return `${year}-${month}-${day}`;
  };

  const onSubmit = () => {};

  return (
    <form
      onSubmit={handleSubmit(nextStep)}
      className="flex flex-col gap-6 mt-12 p-4 bg-white shadow-md rounded-2xl px-8 pt-8 pb-12"
    >
      <h2 className="text-header-dark text-heading-l font-[700]">
        Tell us about yourself
      </h2>

      <fieldset className="fieldset text-body-m">
        <section className="flex gap-2">
          <legend className="fieldset-legend font-[400]">Birth date</legend>
        </section>
        <input
          type="date"
          className="input w-full"
          min={'1900-01-01'}
          max={getTodayString()}
        />

        {/* 
          This is already done by min and max
          <FieldValidationError>{errors.birthDate?.message}</FieldValidationError> 
        */}
      </fieldset>

      <div>
        <fieldset className="fieldset text-body-m">
          <legend className="fieldset-legend font-[400]">Bio</legend>
          <textarea
            className="textarea h-24 w-full"
            placeholder="Tell us about yourself..."
            {...register('description', {
              maxLength: {
                value: 1000,
                message: '1000 character limit exceeded',
              },
            })}
          ></textarea>
        </fieldset>
        <FieldValidationError>
          {errors.description?.message}
        </FieldValidationError>
      </div>

      <div className="relative">
        <fieldset className="fieldset text-body-m">
          <legend className="fieldset-legend font-[400]">City</legend>
          <div
            className="input flex justify-between items-center cursor-pointer"
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
          >
            <span>{selectedCity || 'Select your city'}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <input
            type="hidden"
            {...register('city', {
              max: 255,
            })}
          />
          <FieldValidationError>{errors.city?.message}</FieldValidationError>
        </fieldset>

        {cityDropdownOpen && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg mt-1">
            {cities.map(city => (
              <li
                key={city}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectCity(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className="flex justify-between w-[100%] mt-4">
        <section>
          <Button
            type="button"
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
            type="button"
            background="bg-white"
            textColor="text-btn"
            hoverColor="hover:bg-gray-50"
            onClick={skipStep}
          >
            Skip
          </Button>
        </section>
        <section>
          <Button type="submit">Next</Button>
        </section>
      </section>
    </form>
  );
});

export default RegistrationSecondStep;
