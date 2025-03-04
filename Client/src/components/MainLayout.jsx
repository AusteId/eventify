import { Outlet } from 'react-router';
import Header from './Header/Header';
import NoSignedInHeader from './Header/NotSignedInHeader';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="h-full bg-gradient-to-b from-[#F3E3C7] via-[#F3E3C7] to-[#F9F4EB] grid grid-rows-[auto_1fr_auto]">
      <NoSignedInHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
