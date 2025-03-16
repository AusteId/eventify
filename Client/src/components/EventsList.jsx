import { useEffect, useState } from 'react';
import EventCard from './EventCard';
import Pagination from './Pagination';
import { staticEventLoader } from '../helpers/staticEventLoader';
import axios from 'axios';
import { getEvents } from '../helpers/event/getEvents';
import { LoaderIcon } from 'react-hot-toast';

const url = 'http://localhost:8080/api/events/';

const EventsList = () => {
  const [data, setData] = useState(null);

  // temporary solution
  const events = staticEventLoader();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // const token = localStorage.getItem('token');
      // console.log(token);
      // const response = await axios.get(url, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const response = await getEvents();
      setData(response);
      console.log(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

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

  if (!data) {
    return <LoaderIcon />;
  }

  console.log(data);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="inline-grid tablet:grid-cols-2 desktop:grid-cols-3 justify-items-center gap-7">
        {/* {currentEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))} */}
        {data.map((eventData, index) => (
          <EventCard
            key={index}
            {...eventData}
            startDateTime={new Date(eventData.startDateTime)}
            endDateTime={new Date(eventData.endDateTime)}
          />
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
