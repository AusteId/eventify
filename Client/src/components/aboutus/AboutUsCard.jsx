import LinkedIn from '../../assets/aboutUs/linkedin.svg';
import Email from '../../assets/aboutUs/email.svg';
import GitHub from '../../assets/aboutUs/github.svg';
import { FaPencil} from "react-icons/fa6";
import { GoX } from "react-icons/go";

const AboutUsCard = ({ name, linkedin, github, mail, photo, onEdit, onDelete,isDarkMode }) => {
  return (
    <div className={`p-4 rounded-lg shadow-lg min-w-[17rem] max-w-[20rem] m-0 duration-750 border ${isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : 'bg-white border-transparent'}`}>
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      {/* Edit and Delete Buttons */}
      <div className={`relative flex justify-end w-full space-x-1 bg-transparent`}>
        <button
          onClick={onEdit}
          className={`flex items-center space-x-2 text-black-500 hover:text-[#f59e0b] transition-all duration-200 ${isDarkMode ? "" : ""}`}
        >
          <FaPencil className={`cursor-pointer scale-90 h-5 w-5 transform duration-200 hover:text-[#f59e0b] hover:scale-150 ${isDarkMode ? "text-gray-200" : "text-header-dark"}`}/>
          <span className="sr-only">Edit</span>

        </button>
        <button
          onClick={onDelete}
          className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-all duration-200"
        >
          <GoX  className="scale-100 h-7 w-7 transform hover:scale-200 cursor-pointer" />
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
          <div className={`text-xl font-semibold duration-750 ${isDarkMode ? "text-[#f59e0b]" : "text-header-dark"}`}>{name}</div>
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
            className={`truncate max-w-[calc(100%-2rem)]  duration-500 ${isDarkMode ? "text-gray-200 hover:text-[#f59e0b]" : "text-header-dark"} `}
          >
            {linkedin}
          </a>
        </div>
      </div>

      {/* GitHub */}
      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <img src={GitHub} alt="GitHub" className={`w-5 h-5 duration-750 ${isDarkMode && "brightness-0 invert"}`} />
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={`truncate max-w-[calc(100%-2rem)]  duration-500 ${isDarkMode ? "text-gray-200 hover:text-[#f59e0b]" : "text-header-dark"}`}
          >
            {github}
          </a>
        </div>
      </div>

      {/* Email */}
      {mail && (
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <img src={Email} alt="email" className={`w-5 h-5 duration-750 ${isDarkMode && "brightness-0 invert"}`} />
            <span className={`duration-500 ${isDarkMode ? "text-gray-200 hover:text-[#f59e0b]" : "text-header-dark"}`}>{mail}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsCard;
