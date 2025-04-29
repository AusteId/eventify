import { Route, Routes } from 'react-router';
import './App.css';
import MainLayout from './components/MainLayout';
import About from './page/About';
import Events from './page/Events';
import Home from './page/Home';
import Login from './page/Login';
import Profile from './page/Profile';
import MyRegistrations from './components/myRegistrations/MyRegistrations';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import RegistrationLayout from './components/Registration/RegistrationLayout';
import { useRef } from 'react';
import RegistrationFirstStep from './components/Registration/RegistrationFirstStep';
import RegistrationSecondStep from './components/Registration/RegistrationSecondStep';
import RegistrationThirdStep from './components/Registration/RegistrationThirdStep';
import RegistrationFourthStep from './components/Registration/RegistrationFourthStep';
import { WebSocketProvider } from './components/chatting/WebSocketContext';
import Chat from './components/chatting/Chat';
import Event from './page/Event';

import BasicModal from './components/BasicModal';
import CreateEventForm from './components/CreateEventForm';
import ProtectedRouteLoggedIn from './components/Auth/ProtectedRouteLoggedIn';
import DarkModeAutocompleteStyles from './components/message/DarkModeAutoCompleteStyles';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminEvents from './components/admin/AdminEvents.jsx';
import AdminComments from './components/admin/AdminComments.jsx';
import BanHistory from './components/admin/BanHistory.jsx';
import BanPage from './components/admin/BanPage.jsx';
import ProtectedRoutes from './components/Auth/ProtectedRoutes.jsx';

function App() {
  const formRefs = useRef([null, null, null, null]);

  return (
    <div>
      <BasicModal id="event_creation_modal">
        <CreateEventForm />
      </BasicModal>
      <DarkModeAutocompleteStyles />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<AuthenticatedLayout />}>
            <Route index element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<Event />} />
            // Admin Access
            <Route
              path="/admin"
              element={
                <ProtectedRoutes requiredRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/user-events/:userId"
              element={
                <ProtectedRoutes requiredRoles={['ADMIN']}>
                  <AdminEvents />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/user-comments/:userId"
              element={
                <ProtectedRoutes requiredRoles={['ADMIN']}>
                  <AdminComments />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/ban-history/:userId"
              element={
                <ProtectedRoutes requiredRoles={['ADMIN']}>
                  <BanHistory />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/ban-page"
              element={
                <ProtectedRoutes requiredRoles={['ADMIN']}>
                  <BanPage />
                </ProtectedRoutes>
              }
            />
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
                  <RegistrationLayout formRefs={formRefs} />
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
            <Route path="/profile/:userId" element={
              <ProtectedRoutes requiredRoles={['ADMIN','USER','BANNED']}>
              <Profile />
              </ProtectedRoutes>} />
            <Route path="/myRegistrations" element={
              <ProtectedRoutes requiredRoles={['ADMIN','USER']}>
              <MyRegistrations />
                </ProtectedRoutes>
            } />
            <Route
              path="/chat"
              element={
                <ProtectedRoutes requiredRoles={['ADMIN','USER']}>
                <WebSocketProvider>
                  <Chat />
                </WebSocketProvider>
                </ProtectedRoutes>
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
