import { Route, Routes } from 'react-router';
import './App.css';
import MainLayout from './components/MainLayout';
import About from './page/About';
import Events from './page/Events';
import Home from './page/Home';
import Login from './page/Login';
import Profile from './page/Profile';
import Registrations from './page/Registrations';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import RegistrationLayout from './components/Registration/RegistrationLayout';
import { useRef } from 'react';
import RegistrationFirstStep from './components/Registration/RegistrationFirstStep';
import RegistrationSecondStep from './components/Registration/RegistrationSecondStep';
import RegistrationThirdStep from './components/Registration/RegistrationThirdStep';
import RegistrationFourthStep from './components/Registration/RegistrationFourthStep';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import ProtectedRouteLoggedIn from './components/Auth/ProtectedRouteLoggedIn';
import Event from './page/Event';

function App() {
  const formRefs = useRef([null, null, null, null]);

  return (
    <div className="">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<AuthenticatedLayout />}>
            <Route index element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<Event />} />
            <Route
              path="/login"
              element={
                <ProtectedRouteLoggedIn>
                  <Login />
                </ProtectedRouteLoggedIn>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRouteLoggedIn>
                  <RegistrationLayout formRefs={formRefs} />{' '}
                </ProtectedRouteLoggedIn>
              }
            >
              <Route
                index
                element={
                  <RegistrationFirstStep
                    ref={el => (formRefs.current[0] = el)}
                  />
                }
              />
              <Route
                path="step2"
                element={
                  <RegistrationSecondStep
                    ref={el => (formRefs.current[1] = el)}
                  />
                }
              />
              <Route
                path="step3"
                element={
                  <RegistrationThirdStep
                    ref={el => (formRefs.current[2] = el)}
                  />
                }
              />
              <Route
                path="step4"
                element={
                  <RegistrationFourthStep
                    ref={el => (formRefs.current[3] = el)}
                  />
                }
              />
            </Route>
            <Route
              path="/profile"
              element={
                // <ProtectedRoute allowedRoles={['USER']}>
                <Profile />
                // </ProtectedRoute>
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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
