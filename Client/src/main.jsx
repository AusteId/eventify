import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './components/Auth/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import { DarkModeProvider } from './components/context/DarkModeContext.jsx';
import './components/context/standalone-notification-system.js';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <DarkModeProvider>
        <App />
        <Toaster />
      </DarkModeProvider>
    </AuthProvider>
  </BrowserRouter>,
);
