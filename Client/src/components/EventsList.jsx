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
  const [filters, setFilters] = useState({
    categoryName: '',
    city: '',
    startDateTime: '',
    endDateTime: '',
    experienceLevel: '',
    minAge: '',
    maxAge: '',
  });
  const eventsPerPage = 12;

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
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
              categoryName: filters.categoryName || undefined,
              city: filters.city || undefined,
              startDateTime: filters.startDateTime || undefined,
              endDateTime: filters.endDateTime || undefined,
              experienceLevel: filters.experienceLevel || undefined,
              minAge: filters.minAge ? parseInt(filters.minAge) : undefined,
              maxAge: filters.maxAge ? parseInt(filters.maxAge) : undefined,
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
  }, 1000);

  return () => clearTimeout(debounceTimeout);
  }, [currentPage, searchTerm, filters]);

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
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(searchInput);
      setCurrentPage(0);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
    setCurrentPage(0);
  };

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

      {/* Laikini input laukeliai filtrams */}
      <div className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          value={filters.categoryName}
          onChange={(event) => handleFilterChange('categoryName', event.target.value)}
          placeholder="Filter by category (e.g., Sports)"
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          value={filters.city}
          onChange={(event) => handleFilterChange('city', event.target.value)}
          placeholder="Filter by city (e.g., Vilnius)"
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          value={filters.startDateTime}
          onChange={(event) => handleFilterChange('startDateTime', event.target.value)}
          placeholder="Filter by start date (yyyy-MM-dd, e.g., 2025-05-01)"
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          value={filters.endDateTime}
          onChange={(event) => handleFilterChange('endDateTime', event.target.value)}
          placeholder="Filter by end date (yyyy-MM-dd, e.g., 2025-06-01)"
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          value={filters.experienceLevel}
          onChange={(event) => handleFilterChange('experienceLevel', event.target.value)}
          placeholder="Filter by experience level (e.g., Beginner)"
          className="w-full p-2 border rounded-md"
        />
        <input
          type="number"
          value={filters.minAge}
          onChange={(event) => handleFilterChange('minAge', event.target.value)}
          placeholder="Filter by min age (e.g., 18)"
          className="w-full p-2 border rounded-md"
        />
        <input
          type="number"
          value={filters.maxAge}
          onChange={(event) => handleFilterChange('maxAge', event.target.value)}
          placeholder="Filter by max age (e.g., 30)"
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
