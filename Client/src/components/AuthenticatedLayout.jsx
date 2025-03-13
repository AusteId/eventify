import { Outlet } from 'react-router';
import Header from './Header/Header';
import NotSignedInHeader from './Header/NotSignedInHeader';
import { useAuth } from './Auth/AuthContext';

const AuthenticatedLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-full flex flex-col">
      {user ? <Header /> : <NotSignedInHeader />}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
