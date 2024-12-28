// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './features/auth/login';
// import Dashboard from './pages/Dashboard';
// //import Navbar from './components/Navbar';
// import PrivateRoute from './components/PrivateRoute';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Navigate to="/login" />} />
//         <PrivateRoute path="/dashboard" component={Dashboard} />
//         <Route path="*" element={<h1>404 - Page Not Found</h1>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute'; // Assuming it's in components folder
import Login from './features/auth/login'; // Adjust path if needed
import Dashboard from './pages/Dashboard'; // Adjust path if needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
