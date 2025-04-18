import LinkedIn from '../assets/aboutUs/linkedin.svg';
import Email from '../assets/aboutUs/email.svg';
import GitHub from '../assets/aboutUs/github.svg';
import { FaPencil} from "react-icons/fa6";
import { GoX } from "react-icons/go";

const AboutUsCard = ({ name, linkedin, github, mail, photo, onEdit, onDelete }) => {
  return (
    <div className="p-4 rounded-lg shadow-lg min-w-[17rem] max-w-[20rem] m-0 bg-white">
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      {/* Edit and Delete Buttons */}
      <div className="flex justify-end w-full space-x-1">
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 text-black-500 hover:text-blue-700 transition-all duration-200"
        >
          <FaPencil className="scale-90 h-5 w-5 transform hover:scale-150"/>
          <span className="sr-only">Edit</span>

        </button>
        <button
          onClick={onDelete}
          className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-all duration-200"
        >
          <GoX  className="scale-100 h-5 w-5 transform hover:scale-200"/>
          <span className="sr-only">Delete</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={photo}
            alt={`${name}'s Profile`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="text-xl font-semibold text-black">{name}</div>
        </div>


      </div>

      {/* LinkedIn */}
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

      {/* GitHub */}
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

      {/* Email */}
      {mail && (
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <img src={Email} alt="email" className="w-5 h-5" />
            <span className="text-black">{mail}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsCard;
