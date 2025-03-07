import React from 'react';
import Button from './Button';
import ButtonCancel from './ButtonCancel';
import {
  convertToCompactEuDatetime,
  formatToOnlyTime,
  isSameDay,
} from '../utils/dateFunctions';

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
  location = 'Location not provided',
  requiredAge = 'Age: All welcome!',
  isEnded,
}) => {
  const expLevels = {
    0: ['bg-welcome', 'All'],
    1: ['bg-beginner', 'Beginner Friendly'],
    2: ['bg-intermediate', 'Intermediate'],
    3: ['bg-advanced', 'Advanced'],
    4: ['bg-extreme', 'Extreme'],
  };

  const wordArr = description?.split(' ');
  const shortDesc = wordArr?.slice(0, 10).join(' ') + '...';

  const timeString =
    startDateTime &&
    endDateTime &&
    `${convertToCompactEuDatetime(startDateTime)} - ${formatToOnlyTime(endDateTime)}`;

  return (
    <div
      className={`flex flex-col justify-between bg-[#FFF] rounded-[0.5rem] max-w-[24.875rem] ${isEnded && 'grayscale-100'}`}
    >
      <div>
        <div className="relative">
          {currentParticipants && (
            <div className="absolute flex top-2 left-2 bg-black/50  gap-1 rounded-full py-[0.38rem] px-[0.75rem] text-sm">
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

        <div className="pt-5 px-5 flex flex-col gap-2">
          <h2 className="text-heading-xs font-[600] leading-[1.125rem]">
            {title}
          </h2>
          {description && <p>{shortDesc}</p>}
          <div className="flex flex-col gap-1">
            {startDateTime ? (
              <figure className="flex gap-2">
                <img src="src/assets/clock.svg" alt="Icon of a clock" />
                {endDateTime ? (
                  <figcaption>{timeString}</figcaption>
                ) : (
                  <figcaption>
                    {convertToCompactEuDatetime(startDateTime)}
                  </figcaption>
                )}
              </figure>
            ) : (
              <figure className="flex gap-2">
                <img src="src/assets/clock.svg" alt="Icon of a clock" />
                <figcaption>Time not provided</figcaption>
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
        </div>
      </div>
      <div className="flex justify-center py-[0.38rem] px-[0.75rem]">
        {isEnded ? (
          <p className="p-3">Completed</p>
        ) : !isRegistered ? (
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
  );
};

export default EventCard;
