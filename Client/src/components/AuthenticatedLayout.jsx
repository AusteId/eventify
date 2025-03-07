import { Outlet } from 'react-router';
import Header from './Header/Header'
import Footer from './Footer';
import NotSignedInHeader from './Header/NotSignedInHeader';

const AuthenticatedLayout = ({ authenticationStatusPlaceholder = true }) => {
  return (
    <div className="h-full bg-gradient-to-b from-light-yellow via-light-yellow to-cream grid grid-rows-[auto_1fr_auto]">
      {authenticationStatusPlaceholder && <Header />}
      {!authenticationStatusPlaceholder && <NotSignedInHeader />}
      <Outlet />
    </div>
  );
};

export default AuthenticatedLayout;