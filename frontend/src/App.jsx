import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MobileContainer from './components/layout/MobileContainer';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import Emergency from './pages/Emergency';
import Records from './pages/Records';
import Meds from './pages/Meds';
import Volunteers from './pages/Volunteers';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';

const AppContent = () => {
  const location = useLocation();

  const getTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard': return 'Thulir';
      case '/emergency': return 'Emergency';
      case '/records': return 'Medical Records';
      case '/meds': return 'Medications';
      case '/appointments': return 'Appointments';
      case '/profile': return 'My Profile';
      case '/volunteers': return 'Volunteer';
      default: return 'Thulir';
    }
  };

  const isAuthPage = ['/', '/welcome', '/login', '/register'].includes(location.pathname);

  return (
    <MobileContainer>
      {!isAuthPage && <Header title={getTitle(location.pathname)} />}
      <main className={`flex-1 overflow-y-auto scrollbar-hide ${isAuthPage ? 'bg-white' : 'bg-slate-50'}`}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/records" element={<Records />} />
          <Route path="/meds" element={<Meds />} />
          <Route path="/volunteers" element={<Volunteers />} />
        </Routes>
      </main>
      {!isAuthPage && <BottomNav />}
    </MobileContainer>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
