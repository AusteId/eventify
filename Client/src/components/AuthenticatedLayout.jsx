import { Outlet } from 'react-router';
import Header from './Header/Header'
import Footer from './Footer';
import NotSignedInHeader from './Header/NotSignedInHeader';

const AuthenticatedLayout = ({ authenticationStatusPlaceholder = true }) => {
  return (
    <div className="min-h-full flex flex-col">
      {authenticationStatusPlaceholder && <Header />}
      {!authenticationStatusPlaceholder && <NotSignedInHeader />}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;