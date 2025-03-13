import { Outlet } from 'react-router';
import Header from './Header/Header';
import NotSignedInHeader from './Header/NotSignedInHeader';
import { useAuth } from './Auth/AuthContext';

const AuthenticatedLayout = () => {
  const { isAuthenticated} = useAuth();

  return (
    <div className="min-h-full flex flex-col">
      {isAuthenticated ? <Header /> : <NotSignedInHeader />}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
