import { Outlet } from 'react-router';
import Footer from './Footer';
import ErrorServer from './message/ErrorServer';
import Success from './message/Success';
import { useNotifications } from './context/NotificationContext';

const MainLayout = () => {
  const {isDarkMode} = useNotifications();

  return (
    <>
      <ErrorServer />
      <Success />
      <div className="relative min-h-screen">
        <div 
          className="absolute inset-0 bg-gradient-to-t from-white via-gradient-light-yellow to-gradient-yellow transition-opacity duration-750"
          style={{ opacity: isDarkMode ? 0 : 1 }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-amber-900 transition-opacity duration-750"
          style={{ opacity: isDarkMode ? 1 : 0 }}
        />
        <div className="relative z-10">
          <div className="flex-1">
            <Outlet />
          </div>
        
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
