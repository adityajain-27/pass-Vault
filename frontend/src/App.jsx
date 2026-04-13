import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SecurityAudit from './pages/SecurityAudit';
import BreachWatch from './pages/BreachWatch';
import Landing from './pages/Landing';
import SecureNotes from './pages/SecureNotes';
import PasswordGenerator from './pages/PasswordGenerator';
import TwoFactorSetup from './pages/TwoFactorSetup';
import CreditCards from './pages/CreditCards';
import MouseGlow from './components/MouseGlow';
import './index.css';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ 
        marginLeft: '260px', 
        width: 'calc(100% - 260px)', 
        minHeight: '100vh',
        background: 'var(--bg-dark)'
      }}>
        {children}
      </main>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/notes" element={<PrivateRoute><SecureNotes /></PrivateRoute>} />
      <Route path="/generator" element={<PrivateRoute><PasswordGenerator /></PrivateRoute>} />
      <Route path="/security-audit" element={<PrivateRoute><SecurityAudit /></PrivateRoute>} />
      <Route path="/breach-watch" element={<PrivateRoute><BreachWatch /></PrivateRoute>} />
      <Route path="/2fa" element={<PrivateRoute><TwoFactorSetup /></PrivateRoute>} />
      <Route path="/cards" element={<PrivateRoute><CreditCards /></PrivateRoute>} />
      <Route path="/favorites" element={<PrivateRoute><Dashboard filterFavorites={true} /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};


import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  // IMPORTANT: Replace with your actual Google Client ID from Google Cloud Console
  const GOOGLE_CLIENT_ID = "242976238918-peuvihimgpjosrvn4hkabqqpq13dlont.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <MouseGlow />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;