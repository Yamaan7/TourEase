import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
  const initialOptions = {
    clientId: "AWg_F2Mdu0EwSw1MqIidCjRDEBrDKCNVDcNaCYXYIpMuKzP5jjkjPifYJcbxj3OsnqhpGbHxtWXZnPYT", // Changed from "client-id" to clientId
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
              <Route path="/" element={<Home />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/learn-more" element={<LearnMore />} />
            </Routes>
          </main>
          <Footer />
          <GoToTop />
          {/* Add Chatbox */}
          <div className="fixed bottom-4 right-4 z-50">
            <Chatbox />
          </div>
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;