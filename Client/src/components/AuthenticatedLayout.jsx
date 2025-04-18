import { Outlet } from 'react-router';
import Header from './Header/Header';
import { useAuth } from './Auth/AuthContext';


const AuthenticatedLayout = ({ currentStep }) => {
  const { loading } = useAuth();

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