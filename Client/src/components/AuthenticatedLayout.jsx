import { Outlet, useLocation } from 'react-router';
import Header from './Header/Header';
import { useAuth } from './Auth/AuthContext';

const AuthenticatedLayout = ({ currentStep }) => {
  const location = useLocation();
  const { loading } = useAuth();

  const isRegisterPage = location.pathname.startsWith('/register');

  return (
    <div className="min-h-full flex flex-col">
      <Header currentStep={currentStep} loading={loading} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
