import './App.css';
import { Route, Routes } from "react-router";
import Home from './page/Home';
import Events from './page/Events';
import Registrations from './page/Registrations';
import About from './page/About';
import Main from './components/Main';

function App() {


  return (
    <Routes>
        <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/myRegistrations" element={<Registrations />} />
            <Route path="/aboutUs" element={<About />} />
          </Route>
    </Routes>
  );
}

export default App;
