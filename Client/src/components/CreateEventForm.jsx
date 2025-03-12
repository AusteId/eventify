import FileDropzone from './FileDropzone';

const CreateEventForm = () => {
  return (
    <form className="">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-header-dark font-inter text-heading-m font-bold">
          Create New Event
        </h1>
        <button className="w-5 h-5">
          <img className="w-full h-full" src="src/assets/close.svg" alt="" />
        </button>
      </div>
      <div>
        <label
          className="block font-inter text-header-dark text-heading-s font-bold mb-4 mt-6"
          htmlFor="filedrop"
        >
          Event Image
        </label>
        <FileDropzone id="filedrop" />
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-header-dark text-heading-s font-bold mb-2"
            htmlFor="event-title"
          >
            Event Title*
          </label>
          <input
            className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            id="event-title"
            type="text"
            placeholder=""
          />
        </div>
        <div className="w-full">
          <label
            className="block font-inter text-header-dark text-heading-s font-bold mb-2"
            htmlFor="event-location"
          >
            Location*
          </label>
          <input
            className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            id="event-location"
            type="text"
            placeholder=""
          />
        </div>
      </div>
    </form>
  );
};

export default CreateEventForm;
