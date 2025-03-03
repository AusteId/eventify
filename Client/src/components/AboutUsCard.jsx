import React from 'react';

const AboutUsCard = ({ name, linkedin, github, phone, mail, photo }) => {
  return (
    <div
      className="p-6 rounded-lg shadow-lg max-w-[20rem]"
      style={{ backgroundColor: 'white' }}
    >
      <div className="flex items-center space-x-4">
        <img
          src={photo}
          alt={`${name}'s Profile`}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div className="text-xl font-semibold text-black">{name}</div>
      </div>

      <div className="mt-4 text-white">
        <div className="flex items-center space-x-2">
          <i className="fab fa-linkedin text-blue-500"></i>
          <a
            href={`https://${linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            {linkedin}
          </a>
        </div>
      </div>

      <div className="mt-2 text-white">
        <div className="flex items-center space-x-2">
          <i className="fab fa-github text-gray-700"></i>
          <a
            href={`https://${github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black"
          >
            {github}
          </a>
        </div>
      </div>

      {phone && (
        <div className="mt-2 text-white">
          <div className="flex items-center space-x-2">
            <i className="fas fa-phone-alt"></i>
            <span className="text-black">{phone}</span>
          </div>
        </div>
      )}
      {mail && (
        <div className="mt-2 text-white">
          <div className="flex items-center space-x-2">
            <i className="fas fa-envelope"></i>
            <span className="text-black">{mail}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsCard;
