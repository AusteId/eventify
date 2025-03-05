import { Outlet } from 'react-router';
import RegistrationHeader from './Header/RegistrationHeader'
import Footer from './Footer';
import AboutRegistrationPage from './Registration/AboutRegistrationPage';

const MainLayout = () => {
  return (
    <div className="h-full bg-gradient-to-b from-light-yellow via-light-yellow to-cream grid grid-rows-[auto_1fr_auto]">
      <RegistrationHeader/>
      <AboutRegistrationPage/>
      <Footer />
    </div>
  );
};

export default MainLayout;
