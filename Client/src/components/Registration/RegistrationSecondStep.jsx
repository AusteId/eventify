import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useOutletContext } from 'react-router';
import Button from '../Button';
import FieldValidationError from '../FieldValidationError';
import RegistrationSteps from '../RegistrationSteps';
import { useNotifications } from '../context/NotificationContext';

const RegistrationSecondStep = forwardRef((props, ref) => {
  const { nextStep, prevStep } = useOutletContext();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const { isDarkMode } = useNotifications();
  const dropdownRef = useRef(null);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
      const fieldsValid = await trigger(['city']);
      return fieldsValid;
    },
  }));

  const selectCity = city => {
    setValue('city', city);
    setCityDropdownOpen(false);
    setSearchTerm('');
  };

  const searchCities = async (query) => {
    if (!query || query.length < 2) {
      setCities([]);
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/cities?query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.geonames && data.geonames.length > 0) {
        const formattedCities = data.geonames.map(city => 
          `${city.name}`
        );
        setCities(formattedCities);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
      }
    };
    if (cityDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cityDropdownOpen]);

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

  return (
    <div>
      <RegistrationSteps step={2} />

      <form
        onSubmit={handleSubmit(nextStep)}
        className={`flex flex-col gap-6 mt-12 p-4 shadow-md rounded-2xl px-8 pt-8 pb-12 border duration-750 ${isDarkMode ? "text-gray-300 border-[#f59e0b] bg-slate-900" : "bg-white border-transparent text-body-medium"}`}
      >
        <h2 className={`text-heading-l font-[700] ${isDarkMode ? 'text-[#f59e0b]' : 'text-header-dark'}`}>
          Tell us about yourself
        </h2>

        <fieldset className="fieldset text-body-m">
          <section className="flex gap-2">
            <legend className={`fieldset-legend font-[400] duration-750 ${isDarkMode && "text-gray-200"}`}>Birth date</legend>
          </section>
          <input
            type="date"
            className={`input w-full border ${
              isDarkMode
                ? 'border-gray-200 bg-transparent text-gray-200 focus-within:border-[#f59e0b] focus-within:ring focus-within:ring-[#f59e0b] focus-within:ring-opacity-50'
                : 'border-gray-300'
            }`}
            min={'1900-01-01'}
            max={getTodayString()}
            {...register('birthDate', {
              validate: value => {
                if (!value) return true;
                const today = new Date();
                const birth = new Date(value);
                return (
                  birth <= today || 'Birth date cannot be in the future'
                );
              },
            })}
          />
        </fieldset>

        <div>
          <fieldset className="fieldset text-body-m">
          <legend className={`fieldset-legend font-[400] duration-750 ${isDarkMode && "text-gray-200"}`}>Bio</legend>
            <textarea
              className={`textarea h-24 w-full ${
                isDarkMode
                  ? 'border-gray-200 bg-transparent text-gray-200 focus-within:border-[#f59e0b] focus-within:ring focus-within:ring-[#f59e0b] focus-within:ring-opacity-50'
                  : 'border-gray-300'
              }`}
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

        <div className="relative" ref={dropdownRef}>
          <fieldset className="fieldset text-body-m">
            <legend className={`fieldset-legend font-[400] duration-750 ${isDarkMode && "text-gray-200"}`}>City</legend>
            <div 
              className={`input flex w-full justify-between items-center cursor-pointer ${
                isDarkMode
                  ? 'border-gray-200 bg-transparent text-gray-200 focus-within:border-[#f59e0b] focus-within:ring focus-within:ring-[#f59e0b] focus-within:ring-opacity-50'
                  : 'border-gray-300'
              }`}
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            >
              <span>{selectedCity || 'Select your city'}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke={`${isDarkMode ? "#f59e0b" : "currentColor"}`}
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
            <div className={`absolute z-10 w-full rounded shadow-lg mt-1 border ${isDarkMode ? "bg-slate-900" : "bg-white border-gray-300"}`}>
              <div className="p-2">
                <input
                  type="text"
                  className={`w-full p-2 rounded border ${
                    isDarkMode
                      ? 'border-gray-600 bg-slate-800 text-gray-200 focus-within:border-[#f59e0b] focus:outline-none'
                      : 'border-gray-300'
                  }`}
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              
              <ul className="max-h-60 overflow-y-auto">
                {isLoading ? (
                  <li className={`px-4 py-2 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Loading...
                  </li>
                ) : cities.length > 0 ? (
                  cities.map((city, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 cursor-pointer ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                      onClick={() => selectCity(city)}
                    >
                      {city}
                    </li>
                  ))
                ) : searchTerm.length > 1 ? (
                  <li className={`px-4 py-2 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    No cities found
                  </li>
                ) : (
                  <li className={`px-4 py-2 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Type at least 2 characters to search
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <section className="flex justify-between w-[100%] mt-4">
          <section>
            <Button
              type="button"
              size="large"
              background={`duration-750 ${isDarkMode ? "bg-slate-600 text-gray-200 hover:bg-slate-700 hover:text-[#f59e0b]" : "bg-white "}`}
              border="border border-btn"
              textColor={`${isDarkMode ? "" : "text-[#f59e0b]"}`}
              onClick={prevStep}
            >
              Back
            </Button>
          </section>
          <section>
            <Button size="large" type="submit">Next</Button>
          </section>
        </section>
      </form>
    </div>
  );
});

export default RegistrationSecondStep;