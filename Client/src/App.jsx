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
import { useEffect, useRef, useState } from 'react';
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
import LazyWebSocketProvider from './components/chatting/LazyWebSocketProvider';
import ProtectedRouteLoggedIn from './components/Auth/ProtectedRouteLoggedIn';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import notificationStore from './components/NotificationStore';

function App() {
  const formRefs = useRef([null, null, null, null]);
  // Registration step moved to here so it could be accessed by header
  const [currentStep, setCurrentStep] = useState(1);
  const { isAuthenticated } = useAuth();
  const [initialized, setInitialized] = useState(false);


  useEffect(() => {
    if (isAuthenticated && !initialized) {

      const timer = setTimeout(() => {
        try {
          const fetchUnread = async () => {
            try {
              const response = await fetch('http://localhost:8080/api/messages/unread', {
                credentials: 'include'
              });
              
              if (response && response.ok) {
                const data = await response.json();
                const totalCount = Object.values(data).reduce((sum, count) => sum + count, 0);
                notificationStore.setUnreadCount(totalCount);
                console.log("App initialization: loaded notifications", totalCount);
              }
            } catch (e) {
              console.error("Error initializing notifications in App:", e);
            }
            setInitialized(true);
          };
          
          fetchUnread();
        } catch (e) {
          console.error("Error in notification initialization:", e);
          setInitialized(true);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, initialized]);

  return (
    <div className="">
      {isAuthenticated && <LazyWebSocketProvider />}

      <BasicModal id="event_creation_modal">
        <CreateEventForm />
      </BasicModal>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            path="/"
            element={<AuthenticatedLayout currentStep={currentStep} />}
          >
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
                  <RegistrationLayout
                    formRefs={formRefs}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                  />
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
                  <Profile />
              }
            />
            <Route
              path="/myRegistrations"
              element={
                // <ProtectedRoute allowedRoles={['USER','ADMIN']}>
                <MyRegistrations />
                // </ProtectedRoute>
              }
            />

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
