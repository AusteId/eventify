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
import { useRef, useState } from 'react';
import RegistrationFirstStep from './components/Registration/RegistrationFirstStep';
import RegistrationSecondStep from './components/Registration/RegistrationSecondStep';
import RegistrationThirdStep from './components/Registration/RegistrationThirdStep';
import RegistrationFourthStep from './components/Registration/RegistrationFourthStep';
import { WebSocketProvider } from './components/chatting/WebSocketContext';
import Chat from './components/chatting/Chat';
import Event from './page/Event';

import BasicModal from './components/BasicModal';
import CreateEventForm from './components/CreateEventForm';
import { useAuth } from './components/Auth/AuthContext';
import ProtectedRouteLoggedIn from './components/Auth/ProtectedRouteLoggedIn';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const formRefs = useRef([null, null, null, null]);

  return (
    <div className="">
      <BasicModal id="event_creation_modal">
        <CreateEventForm />
      </BasicModal>

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
            <Route path="/profile" element={<Profile />} />
            <Route path="/myRegistrations" element={<MyRegistrations />} />

            <Route
              path="/chat"
              element={
                <WebSocketProvider>
                  <Chat />
                </WebSocketProvider>
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
