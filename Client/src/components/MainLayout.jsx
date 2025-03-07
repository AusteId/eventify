import { Outlet } from 'react-router';
import Header from './Header/Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-light-yellow via-light-yellow to-cream grid grid-rows-[auto_1fr_auto]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
