import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to SLTBOnline</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/LoginPage')}
      >
        Login
      </Button>
    </div>
  );
};
// In any component, e.g., Home.js
console.log('Home component rendered');

export default Home;
