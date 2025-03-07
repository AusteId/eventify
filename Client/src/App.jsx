import './App.css';
import { Route, Routes } from 'react-router';
import Home from './page/Home';
import Events from './page/Events';
import Registrations from './page/Registrations';
import About from './page/About';
import MainLayout from './components/MainLayout';
import UserRegistration from './page/UserRegistration';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import RegistrationLayout from './components/Registration/RegistrationLayout';

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<AuthenticatedLayout />}>
            <Route index element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/myRegistrations" element={<Registrations />} />
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
