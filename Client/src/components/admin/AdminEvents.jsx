import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import EventsList from '../EventsList.jsx';

const UserEvents = () => {
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const { isDarkMode } = useDarkMode();

  const userEventsEndpoint = `${import.meta.env.VITE_BACK_URL}/api/admin/creator/${userId}`;
  const userMapEndpoint = `${import.meta.env.VITE_BACK_URL}/api/admin/creator/${userId}/map`;



  return (
    <div className="flex flex-col items-center gap-5 py-10 px-10 text-black">
      <div className={`flex flex-col justify-start gap-8 h-full items-center tablet:items-baseline ${loading && "tablet:items-center"}`}>
        <h1 className={`text-heading-m font-[700] leading-[1.5rem] ${isDarkMode && "text-gray-200"} ${loading && "text-center"}`}>
        </h1>

        <div className="h-full">
          <EventsList
            setLoading={setLoading}
            loading={loading}
            apiEndpoint={userEventsEndpoint}
            apiMapEndpoint={userMapEndpoint}
          />
        </div>
      </div>
    </div>
  );
};

export default UserEvents;