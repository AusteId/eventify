import './App.css';
import { Route, Routes } from 'react-router';
import Home from './page/Home';
import Events from './page/Events';
import Registrations from './page/Registrations';
import About from './page/About';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/myRegistrations" element={<Registrations />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
