import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import CommuterRoutes from './pages/Commuter/CommuterRoutes';
import OperatorRoutes from './pages/Operator/OperatorRoutes';
import AdminRoutes from './pages/Admin/AdminRoutes';

import { checkAuth } from './services/authService'; // Custom hook or function to check JWT validity

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    const userData = checkAuth(); // Check user login status and role
    setUser(userData);
    if (!userData) {
      navigate('/login'); // Redirect to login page if no user data found
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <Sidebar user={user} />
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Redirect to home page if user is not logged in */}
          {user ? (
            user.role === 'commuter' ? (
              <Route path="/commuter/*" element={<CommuterRoutes />} />
            ) : user.role === 'operator' ? (
              <Route path="/operator/*" element={<OperatorRoutes />} />
            ) : user.role === 'admin' ? (
              <Route path="/admin/*" element={<AdminRoutes />} />
            ) : (
              <Route path="/" element={<Home />} />
            )
          ) : (
            <Route path="/" element={<Home />} />
          )}

          {/* Fallback Route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
