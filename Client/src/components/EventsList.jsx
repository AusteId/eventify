import { useCallback, useEffect, useState } from 'react';
import EventCard from './EventCard';
import Pagination from './Pagination';
import { staticEventLoader } from '../helpers/staticEventLoader';
import axios from 'axios';

const EventsList = ({ setLoading, loading }) => {
  const [data, setData] = useState(null);

  // temporary solution

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_URL}/api/events/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setData(staticEventLoader());
      } finally {
        console.log('done');
        setLoading(false);
      }
    };

    fetchData(); // Call the function
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

  const events = data || '';

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
      {loading ? (
        <span className="loading loading-bars loading-xl"></span>
      ) : (
        <div className="inline-grid tablet:grid-cols-2 desktop:grid-cols-3 justify-items-center gap-7">
          {currentEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default EventsList;
