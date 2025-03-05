import { Outlet } from 'react-router';
import Header from './Header/Header';
import NoSignedInHeader from './Header/NotSignedInHeader';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="h-full bg-gradient-to-b from-light-yellow via-light-yellow to-cream grid grid-rows-[auto_1fr_auto]">
      <NoSignedInHeader />
      <Header/>
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
