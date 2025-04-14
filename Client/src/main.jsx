import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './components/Auth/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from './components/context/NotificationContext.jsx';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
            <App />
            <Toaster />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
