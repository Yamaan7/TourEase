import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tours from './pages/Tours';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import LearnMore from './pages/LearnMore';
import GoToTop from './components/GoToTop';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Chatbox from './components/Chatbox';
import AgencyReg from './pages/AgencyReg';
import AgencyLogin from './pages/AgencyLogin';
import AgencyDashboard from './pages/AgencyDashboard';
import AdminLogin from './pages/AdminLogin';
import EmergencyButton from './components/Emergencybutton';
import ForgotPassword from './components/ForgotPassword';



function App() {
  const initialOptions = {
    clientId: "AWg_F2Mdu0EwSw1MqIidCjRDEBrDKCNVDcNaCYXYIpMuKzP5jjkjPifYJcbxj3OsnqhpGbHxtWXZnPYT",
    currency: "USD",
    intent: "capture",
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Redirect root path to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/agencylogin" element={<AgencyLogin />} />
              <Route path="/agency-registration" element={<AgencyReg />} />
              <Route path="/agency-dashboard" element={<AgencyDashboard />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </main>
          <Footer />
          <GoToTop />
          <div className="fixed right-4 bottom-4 flex flex-col items-end space-y-4">
            <EmergencyButton />
            <Chatbox />
          </div>
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;