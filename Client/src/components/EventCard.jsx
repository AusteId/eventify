import React from 'react';
import Button from './Button';
import ButtonCancel from './ButtonCancel';
import {
  convertToCompactEuDatetime,
  formatToOnlyTime,
} from '../utils/dateFunctions';
import { useNavigate } from 'react-router';

const EventCard = ({
  id = 0,
  experienceLevel = 'All Welcome',
  isRegistered = 0,
  eventHandler,
  currentParticipants = 0,
  maxParticipants = 1,
  name = 'Title missing...',
  description,
  startDateTime,
  endDateTime,
  city = 'Location not provided',
  isEnded,
  minAge,
  maxAge,
}) => {
  const navigate = useNavigate();
  const normalizedExpLevel = experienceLevel ? experienceLevel : 'All Welcome';

  const expLevels = {
    'All Welcome': ['bg-welcome', 'All Welcome!'],
    Beginner: ['bg-beginner', 'Beginner Friendly'],
    Intermediate: ['bg-intermediate', 'Intermediate'],
    Advanced: ['bg-advanced', 'Advanced'],
    Extreme: ['bg-extreme', 'Extreme'],
  };

  const wordArr = description?.split(' ');
  let shortDesc;
  if (wordArr.length > 10) {
    const lastWord = wordArr[9];
    const cleanedLastWord =
      lastWord.endsWith('.') || lastWord.endsWith(',')
        ? lastWord.slice(0, -1)
        : lastWord;
    wordArr[9] = cleanedLastWord;
    shortDesc = wordArr?.slice(0, 10).join(' ') + '...';
  } else {
    wordArr?.join(' ');
  }

  const timeString =
    startDateTime && endDateTime
      ? `${convertToCompactEuDatetime(startDateTime)} - ${formatToOnlyTime(endDateTime)}`
      : 'N/A';

  const ageString =
    minAge !== null && maxAge !== null
      ? `Min age: ${minAge} - max age: ${maxAge}`
      : minAge !== null
        ? `Min age: ${minAge}`
        : maxAge !== null
          ? `Max age: ${maxAge}`
          : 'All Welcome!';

  return (
    <div
      className={`flex flex-col justify-between bg-white rounded-[0.5rem] h-104 desktop:h-108 max-w-[22rem] desktop:max-w-[24.875rem] ${isEnded && 'grayscale-100'}`}
    >
      <div>
        <a
          onClick={() => navigate(`/events/${id}`)}
          className="cursor-pointer group"
        >
          <div className="relative">
            {currentParticipants !== null && (
              <div className="absolute flex top-2 left-2 bg-black/50  gap-1 rounded-full py-[0.38rem] px-[0.75rem] text-sm">
                <img src="./src/assets/threePersonIcon.svg" />
                <p className="text-white">
                  {currentParticipants}/{maxParticipants}
                </p>
              </div>
            )}
            {experienceLevel != 0 && (
              <div
                className={`absolute right-2 top-2 ${expLevels[normalizedExpLevel][0] ?? ''} rounded-full py-1.5 px-3 text-[0.875rem]`}
              >
                <p className="text-white">{expLevels[normalizedExpLevel][1]}</p>
              </div>
            )}
            {/* <a onClick={() => {}} className="cursor-pointer"> */}
            <img
              src="./src/assets/eventCardImgSample.png"
              className="rounded-t-[0.5rem]"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-[0.5rem]"></div>
          </div>
        </a>

        <div className="pt-5 px-5 flex flex-col gap-2">
          <h2 className="text-heading-xs font-[600] leading-[1.125rem]">
            {name}
          </h2>
          {description && <p className="h-12">{shortDesc}</p>}
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
            {city && (
              <figure className="flex gap-2">
                <img src="src/assets/mapMarker.svg" alt="Icon of map marker" />
                <figcaption>{city}</figcaption>
              </figure>
            )}
            {ageString && (
              <figure className="flex gap-2">
                <img src="src/assets/age.svg" alt="Icon representing age" />
                <figcaption>{ageString}</figcaption>
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
