import { useForm } from 'react-hook-form';
import FieldValidationError from './FieldValidationError';
import createEvent from '../helpers/event/createEvent';
import { useEffect, useState } from 'react';
import getCategories from '../helpers/event/getCategories';
import { LoaderIcon } from 'react-hot-toast';
import ImageDropzone from './Registration/ImageDropZone';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import toast from 'react-hot-toast';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { useNotifications } from './context/NotificationContext';
import Button from './Button';
import CloseSVG from '../assets/CloseSVG';

const CreateEventForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      picture: null,
      name: '',
      city: '',
      address: '',
      startDateTime: null,
      endDateTime: null,
      category: 'Select Category',
      minAge: null,
      maxAge: null,
      maxParticipants: null,
      description: '',
      experienceLevel: 'Select Experience Level',
      latitude: null,
      longitude: null,
    },
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);
  const { isDarkMode } = useNotifications();
  const picture = watch('picture');
  const city = watch('city');
  const address = watch('address');

  const provider = new OpenStreetMapProvider();

  const fetchCoordinates = async () => {
    if (!city || !address) {
      setValue('latitude', null);
      setValue('longitude', null);
      setGeocodingError(null);
      return;
    }

    const query = `${city}, ${address}`;

    try {
      const results = await provider.search({ query });
      if (results.length > 0) {
        const { x, y } = results[0];
        setValue('latitude', y);
        setValue('longitude', x);
        setGeocodingError(null);
      } else {
        setValue('latitude', null);
        setValue('longitude', null);
        setGeocodingError('Could not find coordinates for this address');
      }
    } catch (err) {
      setValue('latitude', null);
      setValue('longitude', null);
      setGeocodingError('Error fetching coordinates');
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, [city, address]);

  const onSubmit = async data => {
    closeModal();
    try {
      console.log('Create event data: ', data);
      const response = await createEvent({
        ...data,
        categoryId: data.category,
        latitude: data.latitude,
        longitude: data.longitude,
      });
      console.log('RESPONSE: ', response);
      toast.success('Event created successfully');
    } catch (error) {
      console.error('Event creation failed: ', error);
      toast.error('Failed to create event');
    }
  };

  const closeModal = () => {
    reset();
    clearErrors();
    document.getElementById('event_creation_modal').close();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  if (isLoading) return <LoaderIcon />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${isDarkMode ? 'bg-slate-900 text-gray-200' : 'text-header-dark'}`}
    >
      <div className="flex w-full items-center justify-between">
        <h1
          className={`font-inter text-heading-m font-bold ${isDarkMode && 'text-[#f59e0b]'}`}
        >
          Create New Event
        </h1>
        <button
          onClick={closeModal}
          type="button"
          className={`w-10 h-10 ${isDarkMode}`}
        >
          <CloseSVG/>
        </button>
      </div>
      <div>
        <label
          className="block font-inter text-body-m font-bold mb-4 mt-6"
          htmlFor="filedrop"
        >
          Event Image
        </label>
        <ImageDropzone
          onFileChange={file => setValue('picture', file)}
          initialPreview={picture ? URL.createObjectURL(picture) : null}
          fieldName="profilePicture"
          acceptedTypes={['image/jpeg', 'image/png']}
          maxSize={5 * 1024 * 1024}
        />
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-title"
          >
            Event Title*
          </label>
          <input
            className={`${isDarkMode ? 'text-gray-200 border-[#f59e0b]' : 'text-body-medium border-input-light'} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
            id="event-title"
            type="text"
            placeholder=""
            name="name"
            {...register('name', {
              required: 'Event title is required',
              pattern: {
                value: /^[A-Za-z0-9\s'-]+$/,
                message: 'Event title can only contain letters and numbers',
              },
              minLength: {
                value: 3,
                message: 'Event title must be at least 3 characters',
              },
              maxLength: {
                value: 100,
                message: 'Event title cannot exceed 100 characters',
              },
            })}
          />
          <FieldValidationError>{errors.title?.message}</FieldValidationError>
        </div>
        <div className="w-full">
          <label
            className="block font-inter  text-body-m font-bold mb-2"
            htmlFor="event-level"
          >
            Experience Level*
          </label>
          <select
            id="event-level"
            defaultValue="Select Experience Level"
            name="experienceLevel"
            {...register('experienceLevel', {
              required: 'Experience level is required',
              validate: value =>
                value !== 'Select Experience Level' ||
                'Please select a valid option',
            })}
            className={`${isDarkMode ? 'text-gray-200 border-[#f59e0b]' : 'text-body-medium border-input-light'} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
          >
            <option disabled={true} className={`duration-750 ${isDarkMode && "bg-slate-900"}`}>Select Experience Level</option>
            <option className={`duration-750 ${isDarkMode && "bg-slate-900"}`}>Beginner</option>
            <option className={`duration-750 ${isDarkMode && "bg-slate-900"}`}>Intermediate</option>
            <option className={`duration-750 ${isDarkMode && "bg-slate-900"}`}>Advanced</option>
            <option className={`duration-750 ${isDarkMode && "bg-slate-900"}`}>Extreme</option>
            <option className={`duration-750 ${isDarkMode && "bg-slate-900"}`}>All Welcome</option>
          </select>
          <FieldValidationError>{errors.level?.message}</FieldValidationError>
        </div>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-city"
          >
            City*
          </label>
          <input
            className={`${isDarkMode ? 'text-gray-200 border-[#f59e0b]' : 'text-body-medium border-input-light'} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
            id="event-city"
            type="text"
            placeholder=""
            name="city"
            {...register('city', {
              required: 'City is required',
              pattern: {
                value:
                  /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/,
                message: 'Invalid city',
              },
            })}
          />
          <FieldValidationError>{errors.city?.message}</FieldValidationError>
        </div>
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-address"
          >
            Address*
          </label>
          <input
            className={`${isDarkMode ? 'text-gray-200 border-[#f59e0b]' : 'text-body-medium border-input-light'} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
            id="event-address"
            type="text"
            placeholder=""
            name="address"
            {...register('address', {
              required: 'Address is required',
              pattern: {
                value: /^[A-Za-ząčęėįšųūž\s\d,.-]+$/i,
                message: 'Invalid address',
              },
            })}
          />
          <FieldValidationError>{errors.address?.message}</FieldValidationError>
        </div>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-date"
          >
            Start Date*
          </label>
          <input
            className={`${isDarkMode ? 'text-gray-200 border-[#f59e0b]' : 'text-body-medium border-input-light'} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
            id="event-date"
            type="datetime-local"
            placeholder=""
            name="startDateTime"
            {...register('startDateTime', {
              required: 'Start date is required',
            })}
          />
          <FieldValidationError>
            {errors.startDateTime?.message}
          </FieldValidationError>
        </div>
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-date-end"
          >
            End Date*
          </label>
          <input
            className={`${isDarkMode ? 'text-gray-200 border-[#f59e0b]' : 'text-body-medium border-input-light'} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
            id="event-date-ende"
            type="datetime-local"
            placeholder=""
            name="endDateTime"
            {...register('endDateTime', {
              required: 'End date is required',
            })}
          />
          <FieldValidationError>
            {errors.endDateTime?.message}
          </FieldValidationError>
        </div>
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-category"
          >
            Category*
          </label>
          <select
            id="event-category"
            defaultValue="Select Category"
            name="category"
            {...register('category', {
              required: 'Category is required',
              validate: value =>
                value !== 'Select Category' || 'Please select a valid option',
            })}
            className={`${isDarkMode ? 'text-gray-200 border-[#f59e0b]' : 'text-body-medium border-input-light'} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}>

            <option disabled={true} className={`duration-750 ${isDarkMode && "bg-slate-900 text-gray-200"}`}>Select Category</option>
            {categories.map((category, index) => (
              <option className={`duration-750 ${isDarkMode && "bg-slate-900"}`} value={category.id} key={index}>
                {capitalizeFirstLetter(category.name)}
              </option>
            ))}
          </select>
          <FieldValidationError>
            {errors.category?.message}
          </FieldValidationError>
        </div>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-minage"
          >
            Minimum Age
          </label>
          <input
            className={`${isDarkMode ? "text-gray-200 border-[#f59e0b] dark-mode-datetime" : "text-body-medium border-input-light"} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
            id="event-minage"
            type="number"
            placeholder=""
            name="minAge"
            min={0}
            max={120}
            {...register('minAge', {
              minLength: {
                value: 0,
                message: 'Minimum age must be 0 or above',
              },
              maxLength: {
                value: 120,
                message: 'Minmum age cannot exceed 120',
              },
            })}
          />
        </div>
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-maxage"
          >
            Maximum Age
          </label>
          <input
            className={`${isDarkMode ? "text-gray-200 border-[#f59e0b] dark-mode-datetime" : "text-body-medium border-input-light"} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
            id="event-maxage"
            type="number"
            placeholder=""
            name="maxAge"
            min={0}
            max={120}
            {...register('maxAge', {
              minLength: {
                value: 0,
                message: 'Maximum age must be 0 or above',
              },
              maxLength: {
                value: 120,
                message: 'Maximum age cannot exceed 120',
              },
            })}
          />
        </div>
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-maxparticipants"
          >
            Maximum Participants*
          </label>
          <input
            className={`${isDarkMode ? "text-gray-200 border-[#f59e0b]" : "text-body-medium border-input-light"} h-10 appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none`}
            id="event-maxparticipants"
            type="number"
            placeholder=""
            name="maxParticipants"
            min={1}
            max={1000}
            {...register('maxParticipants', {
              required: 'Maximum Participants is required',
            })}
          />
          <FieldValidationError>{errors.maxp?.message}</FieldValidationError>
        </div>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="event-description"
          >
            Description
          </label>
          <textarea
            id="event-description"
            className={` ${isDarkMode ? "text-gray-200 border-[#f59e0b]" : "text-body-medium border-input-light"} field-sizing-fixed resize-none font-inter text-body-medium text-body-m w-full bg-transparent placeholder:text-slate-400 text-sm border rounded-md px-3 py-2 focus:outline-none ...`}
            rows="3"
            placeholder="Describe the event..."
            {...register('description', {
              maxLength: {
                value: 1000,
                message: 'Description cannot exceed 1000 characters',
              },
            })}
          ></textarea>
          <FieldValidationError>
            {errors.description?.message}
          </FieldValidationError>
        </div>
      </div>
      <div className="flex mt-6 gap-6  justify-end">
        <Button
          type="button"
          onClick={closeModal}
          background={`duration-750 ${isDarkMode ? "bg-slate-900 border-1 border-[#f59e0b] hover:bg-slate-600" : "bg-white border-1 border-gray-300"}`}
          hoverColor={`duration-750 ${isDarkMode && "hover:text-[#f59e0b]"}`}
          textColor={`duration-750 ${isDarkMode && "text-[#f59e0b]"}`}
        >
          <p>Cancel</p>
        </Button>
        <button
          type="submit"
          className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-6 pt-3 pb-3 rounded-lg text-white"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
