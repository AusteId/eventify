import { useEffect, useState } from 'react';
import EventCard from '../EventCard';
import LoadingSection from '../LoadingSection';
import Pagination from '../Pagination';
import { useAuth } from '../Auth/AuthContext';

const MyEventsList = ({ endpoint }) => {
  const { authFetch } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const eventsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await authFetch(
          `${import.meta.env.VITE_BACK_URL}${endpoint}`,
          {
            method: 'GET',
            params: {
              page: currentPage,
              size: eventsPerPage,
              sortBy: 'startDateTime',
              sortDirection: 'ASC',
            },
          }
        );

        if (!response) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();


        setEvents(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
        setEvents([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, endpoint, authFetch]);

  const paginate = pageNumber => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      {loading ? (
        <LoadingSection />
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <div className="inline-grid tablet:grid-cols-2 desktop:grid-cols-3 justify-items-center gap-7">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage + 1}
          paginate={page => paginate(page - 1)}
        />
      )}
    </div>
  );
};

export default MyEventsList;