import { useForm } from 'react-hook-form';
import FieldValidationError from './FieldValidationError';
import FileDropzone from './FileDropzone';

const CreateEventForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: null,
      title: '',
      city: '',
      address: '',
      start_date: null,
      end_date: null,
      category: 'Select Category',
      minage: null,
      maxage: null,
      maxp: null,
      description: '',
      level: 'Select Experience Level',
    },
  });

  const onSubmit = async data => {
    try {
      // whatever
    } catch (error) {
      console.error('Event creation failed: ', error);
    }
  };

  const closeModal = () => {
    reset();
    clearErrors();
    document.getElementById('event_creation_modal').close();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-header-dark font-inter text-heading-m font-bold">
          Create New Event
        </h1>
        <button onClick={closeModal} type="button" className="w-10 h-10">
          <img
            className="w-full h-full p-2"
            src="src/assets/close.svg"
            alt=""
          />
        </button>
      </div>
      <div>
        <label
          className="block font-inter text-header-dark text-body-m font-bold mb-4 mt-6"
          htmlFor="filedrop"
        >
          Event Image
        </label>
        <FileDropzone id="filedrop" />
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-title"
          >
            Event Title*
          </label>
          <input
            className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            id="event-title"
            type="text"
            placeholder=""
            name="title"
            {...register('title', {
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
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-level"
          >
            Experience Level*
          </label>
          <select
            id="event-level"
            defaultValue="Select Experience Level"
            name="level"
            {...register('level', {
              required: 'Experience level is required',
              validate: value =>
                value !== 'Select Experience Level' ||
                'Please select a valid option',
            })}
            className="select h-10 appearance-none border border-input-light rounded-lg w-full text-body-medium focus:outline-none"
          >
            <option disabled={true}>Select Experience Level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Extreme</option>
          </select>
          <FieldValidationError>{errors.level?.message}</FieldValidationError>
        </div>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-city"
          >
            City*
          </label>
          <input
            className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
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
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-address"
          >
            Address*
          </label>
          <input
            className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            id="event-address"
            type="text"
            placeholder=""
            name="address"
            {...register('address', {
              required: 'Address is required',
              pattern: {
                value: /^[\w\s ,.]+$/,
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
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-date"
          >
            Start Date*
          </label>
          <input
            className="input h-10  appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            id="event-date"
            type="datetime-local"
            placeholder=""
            name="start_date"
            {...register('start_date', {
              required: 'Start date is required',
            })}
          />
          <FieldValidationError>
            {errors.start_date?.message}
          </FieldValidationError>
        </div>
        <div className="w-full">
          <label
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-date-end"
          >
            End Date*
          </label>
          <input
            className="input h-10  appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            id="event-date-ende"
            type="datetime-local"
            placeholder=""
            name="end_date"
            {...register('end_date', {
              required: 'End date is required',
            })}
          />
          <FieldValidationError>
            {errors.end_date?.message}
          </FieldValidationError>
        </div>
        <div className="w-full">
          <label
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
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
            className="select h-10 appearance-none border border-input-light rounded-lg w-full text-body-medium focus:outline-none"
          >
            <option disabled={true}>Select Category</option>
            <option>Sports</option>
            <option>Music</option>
            <option>Social Games</option>
          </select>
          <FieldValidationError>
            {errors.category?.message}
          </FieldValidationError>
        </div>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-minage"
          >
            Minimum Age
          </label>
          <input
            className="input validator h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            id="event-minage"
            type="number"
            placeholder=""
            name="minage"
            min={0}
            max={120}
            {...register('minage', {
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
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-maxage"
          >
            Maximum Age
          </label>
          <input
            className="input validator h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            id="event-maxage"
            type="number"
            placeholder=""
            name="maxage"
            min={0}
            max={120}
            {...register('maxage', {
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
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-maxparticipants"
          >
            Maximum Participants*
          </label>
          <input
            className="input validator h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            id="event-maxparticipants"
            type="number"
            placeholder=""
            name="maxp"
            min={1}
            max={1000}
            {...register('maxp', {
              required: 'Maximum Participants is required',
            })}
          />
          <FieldValidationError>{errors.maxp?.message}</FieldValidationError>
        </div>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-description"
          >
            Description
          </label>
          <textarea
            id="event-description"
            className="field-sizing-fixed resize-none font-inter text-body-medium text-body-m w-full bg-transparent placeholder:text-slate-400 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none ..."
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
        <button
          type="button"
          onClick={closeModal}
          className="btn bg-white border border-input-light shadow-none hover:bg-input-light px-6 pt-3 pb-3 rounded-lg"
        >
          <p className="text-body-medium">Cancel</p>
        </button>
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
