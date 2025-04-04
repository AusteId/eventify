import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaList, FaMap } from 'react-icons/fa';
import EventCard from './EventCard';
import LoadingSection from './LoadingSection';
import EventMap from './map/EventMap';
import Pagination from './Pagination';
import EventSearch from './search/EventSearch';

const EventsList = ({ setLoading, loading }) => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    filters: {
      categoryName: '',
      city: '',
      startDateTime: '',
      endDateTime: '',
      experienceLevel: '',
      minAge: '',
      maxAge: '',
    },
    sortBy: 'startDateTime',
    sortDirection: 'ASC',
  });
  const [showMap, setShowMap] = useState(false);
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
              sortBy: searchParams.sortBy,
              sortDirection: searchParams.sortDirection,
              searchTerm: searchParams.searchTerm || undefined,
              categoryName: searchParams.filters.categoryName || undefined,
              city: searchParams.filters.city || undefined,
              startDateTime: searchParams.filters.startDateTime || undefined,
              endDateTime: searchParams.filters.endDateTime || undefined,
              experienceLevel:
                searchParams.filters.experienceLevel || undefined,
              minAge: searchParams.filters.minAge
                ? parseInt(searchParams.filters.minAge)
                : undefined,
              maxAge: searchParams.filters.maxAge
                ? parseInt(searchParams.filters.maxAge)
                : undefined,
            },
          },
        );
        console.log(response.data);
        setEvents(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log(
          'Error details:',
          error.response?.data,
          error.response?.status,
        );
        setEvents([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchParams, setLoading]);

  const paginate = pageNumber => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleSearch = newSearchParams => {
    setSearchParams(newSearchParams);
    setCurrentPage(0);
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <EventSearch onSearch={handleSearch} />

      <div className="flex flex-col tablet:flex-row tablet:justify-end mb-4 gap-2 items-center tablet:items-start">
        <button
          onClick={toggleMapView}
          className="text-body-medium rounded-lg border-0 flex items-center gap-2 font-inter hover:bg-btn/8 py-2 h-8 px-2 opacity-85 text-sm"
        >
          {showMap ? (
            <>
              <FaList className="text-btn" />
              View as List
            </>
          ) : (
            <>
              <FaMap className="text-btn" />
              View on Map
            </>
          )}
        </button>
      </div>

      {loading ? (
        <LoadingSection />
      ) : showMap ? (
        <EventMap />
      ) : events.length === 0 ? (
        <p>Events not found</p>
      ) : (
        <div className="inline-grid tablet:grid-cols-2 desktop:grid-cols-3 justify-items-center gap-7">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      )}

      {!showMap && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage + 1}
          paginate={page => paginate(page - 1)}
        />
      )}
    </div>
  );
};

export default EventsList;
