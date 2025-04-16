import LinkedIn from '../assets/aboutUs/linkedin.svg';
import Email from '../assets/aboutUs/email.svg';
import Phone from '../assets/aboutUs/phone.svg';
import GitHub from '../assets/aboutUs/github.svg';

const AboutUsCard = ({ name, linkedin, github, mail, photo, onEdit, onDelete }) => {
  return (
    <div
      className="p-4 rounded-lg shadow-lg min-w-[17rem] max-w-[20rem] m-0 bg-white"
    >
      <div className="flex items-center space-x-4">
        <img
          src={photo}
          alt={`${name}'s Profile`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="text-xl font-semibold text-black">{name}</div>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <img src={LinkedIn} alt="linkedIn" className="w-5 h-5" />
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 truncate max-w-[calc(100%-2rem)]"
          >
            {linkedin}
          </a>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <img src={GitHub} alt="GitHub" className="w-5 h-5" />
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black truncate max-w-[calc(100%-2rem)]"
          >
            {github}
          </a>
        </div>
      </div>

      {mail && (
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <img src={Email} alt="email" className="w-5 h-5" />
            <span className="text-black">{mail}</span>
          </div>
        </div>
      )}

      {/* Edit and Delete Buttons */}
      <div className="flex justify-between mt-4 space-x-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-200 text-white rounded-lg hover:bg-blue-400"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-200 text-white rounded-lg hover:bg-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AboutUsCard;
