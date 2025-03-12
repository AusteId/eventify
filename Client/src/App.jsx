import { Route, Routes } from 'react-router';
import './App.css';
import MainLayout from './components/MainLayout';
import About from './page/About';
import Events from './page/Events';
import Home from './page/Home';
import Login from './page/Login';
import Profile from './page/Profile';
import Registrations from './page/Registrations';
import UserRegistration from './page/UserRegistration';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import RegistrationLayout from './components/Registration/RegistrationLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<AuthenticatedLayout />}>
            <Route index element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myRegistrations"
              element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <Registrations />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/register" element={<RegistrationLayout />}>
            <Route index element={<UserRegistration />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
