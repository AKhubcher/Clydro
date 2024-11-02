import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import SprinklerDashboard from './components/SprinklerDashboard';
import Settings from './components/Profile/Settings';
import Account from './components/Profile/Account';
import Notifications from './components/Profile/Notifications';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <SprinklerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/profile/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="settings" element={<Settings />} />
                  <Route path="account" element={<Account />} />
                  <Route path="notifications" element={<Notifications />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;