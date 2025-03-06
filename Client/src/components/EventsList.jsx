import React, { useState } from 'react';
import EventCard from './EventCard';
import Pagination from './Pagination';

const EventsList = () => {
  const start = new Date();
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const events = [
    {
      title: 'Event 1',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 2',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 3',
      experienceLevel: 2,
      isRegistered: 1,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 4',
      experienceLevel: 2,
      isRegistered: 1,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 5',
      experienceLevel: 2,
      isRegistered: 1,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 6',
      experienceLevel: 2,
      isRegistered: 1,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 7',
      experienceLevel: 2,
      isRegistered: 1,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 28',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 29',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 30',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 31',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 32',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 33',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 34',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 35',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 36',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 37',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 38',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 39',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 40',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 41',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 42',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 43',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 43',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 43',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 43',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 43',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 43',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 43',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 43',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
    {
      title: 'Event 43',
      experienceLevel: 2,
      isRegistered: 0,
      currentParticipants: 2,
      maxParticipants: 9,
      startDateTime: start,
      endDateTime: end,
      location: 'Paulino g. 20',
      requiredAge: '+18',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  const paginate = pageNumber => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 100);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="inline-grid tablet:grid-cols-2 desktop:grid-cols-3 justify-items-center gap-7">
        {currentEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default EventsList;
