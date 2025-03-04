import React from 'react';
import Button from './Button';
import ButtonCancel from './ButtonCancel';
import convertToCompactEuDatetime from '../utils/convertToCorrectDateTime';

const EventCard = ({
  experienceLevel,
  isRegistered = 0,
  eventHandler,
  currentParticipants,
  maxParticipants = 1,
  title = 'Title missing...',
  description,
  startDateTime,
  endDateTime,
  location,
  requiredAge,
}) => {
  const expLevels = {
    0: ['bg-welcome', 'All'],
    1: ['bg-beginner', 'Beginner Friendly'],
    2: ['bg-intermediate', 'Intermediate'],
    3: ['bg-advanced', 'Advanced'],
    4: ['bg-extreme', 'Extreme'],
  };

  return (
    <div className="bg-[#FFF] rounded-[0.5rem] max-w-[24.875rem]">
      <div className="relative">
        {currentParticipants && (
          <div className="absolute flex top-2 left-2 bg-black/50  gap-1 rounded-full py-[0.38rem] px-[0.75rem] text-[0.875rem]">
            <img src="./src/assets/threePersonIcon.svg" />
            <p className="text-[#FFF]">
              {currentParticipants}/{maxParticipants}
            </p>
          </div>
        )}

        {experienceLevel != 0 && (
          <div
            className={`absolute right-2 top-2 ${expLevels[experienceLevel][0]} rounded-full py-[0.38rem] px-[0.75rem] text-[0.875rem]`}
          >
            <p className="text-[#FFF]">{expLevels[experienceLevel][1]}</p>
          </div>
        )}

        <img
          src="./src/assets/eventCardImgSample.png"
          className="rounded-t-[0.5rem]"
        />
      </div>
      <div className="p-5 flex flex-col gap-2">
        <h2 className="text-heading-xs font-[600] leading-[1.125rem]">
          {title}
        </h2>
        <p>{description}</p>
        <div className="flex flex-col gap-1">
          {startDateTime && (
            <figure className="flex gap-2">
              <img src="src/assets/clock.svg" alt="Icon of a clock" />
              <figcaption>
                {convertToCompactEuDatetime(startDateTime)} -{' '}
                {convertToCompactEuDatetime(endDateTime)}
              </figcaption>
            </figure>
          )}

          {location && (
            <figure className="flex gap-2">
              <img src="src/assets/mapMarker.svg" alt="Icon of map marker" />
              <figcaption>{location}</figcaption>
            </figure>
          )}

          {requiredAge && (
            <figure className="flex gap-2">
              <img src="src/assets/age.svg" alt="Icon representing age" />
              <figcaption>{requiredAge}</figcaption>
            </figure>
          )}
        </div>
        <div className="flex">
          {!isRegistered ? (
            <Button isFull={true} onClick={eventHandler}>
              +Register
            </Button>
          ) : (
            <ButtonCancel isFull={true} onClick={eventHandler}>
              <img src="src/assets/xIcon.svg" className="border-0" />
              Cancel Registration
            </ButtonCancel>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
