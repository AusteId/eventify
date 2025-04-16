import { useEffect, useState, useRef } from 'react';
import EventCard from '../EventCard';
import LoadingSection from '../LoadingSection';
import Pagination from '../Pagination';
import { useAuth } from '../Auth/AuthContext';

const MyEventsList = ({ endpoint, setLoading, loading, isDarkMode }) => {
  const { authFetch } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const eventsPerPage = 12;

  const authFetchRef = useRef(authFetch);

  useEffect(() => {
    authFetchRef.current = authFetch;
  }, [authFetch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for page:', currentPage);
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: currentPage,
          size: eventsPerPage,
          sortBy: 'startDateTime',
          sortDirection: 'ASC',
        }).toString();

        const urlWithParams = `${import.meta.env.VITE_BACK_URL}${endpoint}?${params}`;

        const response = await authFetchRef.current(urlWithParams, {
          method: 'GET',
        });

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

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });

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
  }, [currentPage, endpoint, setLoading]);

  const paginate = pageNumber => {
    console.log('Paginate called with page:', pageNumber);
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      {loading ? (
        <LoadingSection />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : events.length === 0 ? (
        <p className={`text-center ${isDarkMode ? "text-gray-300/85" : "text-gray-500"}`}>
          {endpoint === '/api/events/user/created-events'
            ? "It looks like you haven't created any events so far. Why not create one now?"
            : "It looks like you haven’t joined any events yet. Start by browsing upcoming events!"}
        </p>
      ) : (
        <div className="inline-grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-7 gap-x-30">
          {events.map((event, index) => (
            <EventCard key={event.id || index} {...event} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage + 1}
            paginate={page => paginate(page - 1)}
          />
        </div>
      )}
    </div>
  );
};

export default MyEventsList;