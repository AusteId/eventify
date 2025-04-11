import { useEffect, useState, useRef } from 'react';
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
  const [error, setError] = useState(null);
  const eventsPerPage = 12;

  const authFetchRef = useRef(authFetch);

  useEffect(() => {
    authFetchRef.current = authFetch;
  }, [authFetch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetchRef.current(
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
          throw new Error('Failed to fetch events: No response');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !data.content || typeof data.totalPages === 'undefined') {
          throw new Error('Failed to fetch events: Invalid response format');
        }

        setEvents(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Error details:', error.message);
        setEvents([]);
        setTotalPages(0);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, endpoint]);

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
    <div className="h-full flex justify-center">
      {loading ? (
        <LoadingSection />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">
          {endpoint === '/api/events/user/created-events'
            ? "It looks like you haven't created any events so far. Why not create one now?"
            : "It looks like you haven’t joined any events yet. Start by browsing upcoming events!"}
        </p>
      ) : (
        <div className="inline-grid tablet:grid-cols-2 desktop:grid-cols-3 justify-items-center gap-7">
          {events.map((event, index) => (
            <EventCard key={event.id || index} {...event} />
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