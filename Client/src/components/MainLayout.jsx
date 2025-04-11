import { Outlet } from 'react-router';
import Header from './Header/Header';
import Footer from './Footer';
import ErrorServer from './message/ErrorServer';
import Success from './message/Success';

const MainLayout = () => {
  return (
    <>
      <ErrorServer />
      <Success />
      <div className="min-h-screen overflow-clip flex flex-col bg-gradient-to-t from-white via-gradient-light-yellow to-gradient-yellow">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
