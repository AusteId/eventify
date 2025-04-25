import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaList, FaMap } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import EventCard from './EventCard';
import LoadingSection from './LoadingSection';
import EventMap from './map/EventMap';
import Pagination from './Pagination';
import EventSearch from './search/EventSearch';
import { useDarkMode } from './context/DarkModeContext.jsx';

const EventsList = ({  loading,
                      setLoading,
                      isAdmin = false,
                      apiEndpoint = `${import.meta.env.VITE_BACK_URL}/api/events/search`,
                      apiMapEndpoint = `${import.meta.env.VITE_BACK_URL}/api/events/map`}) => {
  
  const [events, setEvents] = useState([]);
  const [eventsForMap, setEventsForMap] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refresh,setRefresh] = useState(0);
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
  const [searchParamsUrl] = useSearchParams();
  const eventId = searchParamsUrl.get('eventId');
  const eventsPerPage = 12;
  const { isDarkMode } = useDarkMode();
  useEffect(() => {
    if (eventId) {
      setShowMap(true);
    }
  }, [eventId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          apiEndpoint,
          {
            withCredentials: true,
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
        setEvents(response.data.content);
        setTotalPages(response.data.totalPages);

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });

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
  }, [currentPage, searchParams,refresh]);

  useEffect(() => {
    const fetchDataForMap = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          apiMapEndpoint,
          {
            withCredentials: true,
            params: {
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
        setEventsForMap(response.data);
      } catch (error) {
        console.error('Error fetching data for map:', error);
        console.log(
          'Error details:',
          error.response?.data,
          error.response?.status,
        );
        setEventsForMap([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataForMap();
  }, [searchParams, setLoading]);

  const paginate = pageNumber => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
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
              <FaList  className='text-btn'/>
             <p className={`duration-750 ${isDarkMode ? "text-gray-200" : "text-btn"}`}>View as List</p>
            </>
          ) : (
            <>
              <FaMap className="text-btn" />
              <p className={`duration-750 ${isDarkMode ? "text-gray-200" : "text-btn"}`}>View on Map</p>
            </>
          )}
        </button>
      </div>

      {loading ? (
        <LoadingSection />
      ) : showMap ? (
        <EventMap events={eventsForMap} eventId={eventId} />
      ) : events.length === 0 ? (
        <p className={`duration-750 ${isDarkMode && "text-gray-200"}`}>Loading...</p>
      ) : (
        <div className="inline-grid tablet:grid-cols-2 desktop:grid-cols-3 justify-items-center gap-7">
          {events.map((event, index) => (
            <EventCard setRefresh={setRefresh} isAdmin={isAdmin} key={index} {...event} />
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
