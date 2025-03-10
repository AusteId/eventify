import { Outlet } from 'react-router';
import Header from './Header/Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-light-yellow via-light-yellow to-cream">
      <div className='flex-1'>
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default MainLayout;
