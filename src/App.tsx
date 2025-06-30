import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Home';
import Leaderboard from './components/Leaderboard';
import Analytics from './components/Analytics';
import Team from './components/Team';
import Calendar from './components/Calendar';
import Documents from './components/Documents';
import Help from './components/Help';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';
import ResetPassword from './components/ResetPassword';


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
  <Router>
    <Routes>
      <Route path="/" element={
        <DashboardLayout>
          <LandingPage />
          </DashboardLayout>
        } />
      <Route path="/leaderboard" element={
        <PrivateRoute>
          <DashboardLayout>
            <Leaderboard />
            </DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/analytics" element={
        <PrivateRoute>
          <DashboardLayout>
            <Analytics />
            </DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/team" element={
        <PrivateRoute>
          <DashboardLayout>
            <Team />
            </DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/calendar" element={
        <PrivateRoute>
          <DashboardLayout>
            <Calendar />
            </DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/documents" element={
        <PrivateRoute>
          <DashboardLayout>
            <Documents />
            </DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/help" element={
        <PrivateRoute>
          <DashboardLayout>
            <Help />
            </DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/home" element={
        <PrivateRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/reset-password" element={
        <DashboardLayout>
        <ResetPassword />
        </DashboardLayout>
      } />
    </Routes>
  </Router>
);
};

export default App;

