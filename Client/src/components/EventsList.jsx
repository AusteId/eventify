import { useEffect, useState } from 'react';
import EventCard from './EventCard';
import Pagination from './Pagination';
import axios from 'axios';

const EventsList = ({ setLoading, loading }) => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const eventsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_URL}/api/events/search`,
          {
            params: {
              page: currentPage,
              size: eventsPerPage,
              sortBy: 'startDateTime',
              sortDirection: 'ASC',
              searchTerm: searchTerm || undefined,
            },
          },
        );

        setEvents(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setEvents([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm]);

  const paginate = pageNumber => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  }

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(searchInput);
      setCurrentPage(0);
    }
  }

  return (
    <div className="h-full flex flex-col justify-between">

      <div className="mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
          placeholder="Search for events..."
          className="w-full p-2 border rounded-md"
        />
      </div>

      {loading ? (
        <span className="loading loading-bars loading-xl"></span>
      ) : events.length === 0 ? (
        <p>Events not found</p>
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
          paginate={(page) => paginate(page - 1)}
        />
      )}
    </div>
  );
};

export default EventsList;
