import Button from './Button';
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
          />
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
          />
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
          />
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
          />
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
          />
        </div>
        <div className="w-full">
          <label
            className="block font-inter text-header-dark text-body-m font-bold mb-2"
            htmlFor="event-category"
          >
            Category*
          </label>
          <select
            defaultValue="Pick a color"
            id="event-category"
            className="select h-10  appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
          >
            <option disabled={true}>Select category</option>
            <option>Sports</option>
            <option>Music</option>
            <option>Social Games</option>
          </select>
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
            min={0}
            max={120}
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
            min={0}
            max={120}
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
            min={1}
            max={1000}
          />
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
            class="field-sizing-fixed resize-none font-inter text-body-medium text-body-m w-full bg-transparent placeholder:text-slate-400 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none ..."
            rows="5"
            placeholder="Describe the event..."
          ></textarea>
        </div>
      </div>
      <div className="flex mt-6 gap-6  justify-end">
        <button className="btn bg-white border border-input-light shadow-none hover:bg-input-light px-6 pt-3 pb-3 rounded-lg">
          <p className="text-body-medium">Cancel</p>
        </button>
        <button className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-6 pt-3 pb-3 rounded-lg">
          <p className="text-white">Create Event</p>
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
