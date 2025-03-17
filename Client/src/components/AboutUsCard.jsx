import React from 'react';
import LinkedIn from '../assets/aboutUs/linkedin.svg';
import Email from '../assets/aboutUs/email.svg';
import Phone from '../assets/aboutUs/phone.svg';
import GitHub from '../assets/aboutUs/github.svg';

const AboutUsCard = ({ name, linkedin, github, phone, mail, photo }) => {

  // FIXME: must be only 3 layouts for screens mobile tablet and desktop
  return (
    <div
      className="p-4 rounded-lg shadow-lg min-w-[17rem] max-w-[20rem] m-0"
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
          <div>
            <img src={LinkedIn} alt="linkedIn" />
          </div>
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
          <div>
            <img src={GitHub} alt="github" />
          </div>
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
          <div>
            <img src={Phone} alt="phone" />
          </div>
            <span className="text-black">{phone}</span>
          </div>
        </div>
      )}

      {mail && (
        <div className="mt-2 text-white">
          <div className="flex items-center space-x-2">
          <div>
            <img src={Email} alt="email" />
          </div>
            <span className="text-black">{mail}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsCard;
