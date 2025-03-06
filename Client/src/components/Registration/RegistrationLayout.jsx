import { Outlet } from 'react-router';
import Header from '../Header/Header'
import Footer from '../Footer';
import RegistrationHeader from '../Header/RegistrationHeader';

const RegistrationLayout = () => {
  return (
    <div className="h-full bg-gradient-to-b from-light-yellow via-light-yellow to-cream grid grid-rows-[auto_1fr_auto]">
        <RegistrationHeader/>
      <Outlet />
    </div>
  );
};

export default RegistrationLayout;