import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import EventsList from '../EventsList.jsx';
import { useAuth } from '../Auth/AuthContext.jsx';
import toast from 'react-hot-toast';

const AdminEvents = () => {
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const {authFetch} = useAuth();
  const { isDarkMode } = useDarkMode();
  const [username, setUsername] = useState('');
  const isAdmin = true;

  const userEventsEndpoint = `${import.meta.env.VITE_BACK_URL}/api/admin/creator/${userId}`;
  const userMapEndpoint = `${import.meta.env.VITE_BACK_URL}/api/admin/creator/${userId}/map`;

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await authFetch(`http://localhost:8080/api/admin/${userId}/username`, {
          method: 'GET',
        });
        if (response.status === 401 || response.status === 403) {
          toast.error("Unauthorized");
        }
          const username = await response.text();
          setUsername(username);

      } catch (error) {
        console.error(error.message || "Server Error");
      }
    }
    fetchUsername();
  },[])



  return (
    <div className="flex flex-col items-center gap-5 py-10 px-10 text-black">
      <div className={`flex flex-col justify-start gap-8 h-full items-center tablet:items-baseline ${loading && "tablet:items-center"}`}>
        <h1 className={`text-heading-m font-[700] leading-[1.5rem] ${isDarkMode && "text-gray-200"} ${loading && "text-center"}`}>
          {username + "'s" || "User's"} events
        </h1>

        <div className="h-full">
          <EventsList
            isAdmin={isAdmin}
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

export default AdminEvents;