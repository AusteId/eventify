import { Outlet } from 'react-router';
import Header from '../Header/Header';
import Footer from '../Footer';
import RegistrationHeader from '../Header/RegistrationHeader';

const RegistrationLayout = () => {
  return (
    <div className="min-h-full flex flex-col">
      <RegistrationHeader />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
};

export default RegistrationLayout;
