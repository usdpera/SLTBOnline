import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');// Store email
  const [password, setPassword] = useState('');// Store password
  const [error, setError] = useState('');// Store error message if any
  const navigate = useNavigate();// Hook to navigate between pages

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);  // Store JWT in local storage
      navigate('/Dashboard');  // Redirect to the home page or dashboard
    } catch (err) {
      setError('Invalid credentials.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin} style={{ marginTop: '20px' }}>
        Login
      </Button>
    </Container>
  );
};

export default LoginPage;
