import { Outlet } from 'react-router';
import Footer from './Footer';
import ErrorServer from './message/ErrorServer';
import Success from './message/Success';
import { useNotifications } from './context/NotificationContext';

const MainLayout = () => {
  const {isDarkmode} = useNotifications();
  return (
    <>
      <ErrorServer />
      <Success />
      <div className="bg-gradient-to-t from-white via-gradient-light-yellow to-gradient-yellow">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
