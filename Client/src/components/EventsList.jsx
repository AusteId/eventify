import { useCallback, useEffect, useState } from 'react';
import EventCard from './EventCard';
import Pagination from './Pagination';
import { staticEventLoader } from '../helpers/staticEventLoader';
import axios from 'axios';

const EventsList = ({ setLoading, loading }) => {
  const [data, setData] = useState([]);

  // temporary solution

useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACK_URL}/api/events`;
        console.log('Fetching from:', url);
        const response = await axios.get(url);
        console.log('API Response:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Error details:', error.response?.data, error.response?.status);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (data.length > 0) {
      console.log('First event:', data[0]);
    } else {
      console.log('Data is empty or not an array:', data);
    }
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

  const events = Array.isArray(data) ? data : [];

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
      ) : currentEvents.length > 0 ? (
        <div className="inline-grid tablet:grid-cols-2 desktop:grid-cols-3 justify-items-center gap-7">
          {currentEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      ) : (
        <p>No events to display</p>
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
