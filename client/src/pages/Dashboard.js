import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2, Paper, Button, Container, CircularProgress } from '@mui/material';
import axiosInstance from '../services/axiosInstance';

const Dashboard = () => {
  const [data, setData] = useState(null); // Store dashboard data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log('Token in localStorage:', token);  // Log token to ensure it's correct
    
      if (!token) {
        setError('No token found. Please login again.');
        window.location.href = '/login'; // Redirect to login if token is missing
        return;
      }
    
      try {
        console.log('Sending request to /dashboard');
        const response = await axiosInstance.get('/dashboard', {
          headers: { Authorization: `Bearer ${token}` }, // Include token in request
        });
        console.log('Response data:', response.data);  // Log response data to see what comes back
        setData(response.data); // Set the fetched data
      } catch (err) {
        console.error('Error fetching dashboard data:', err.response || err);
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{data?.totalUsers || 0}</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Buses</Typography>
              <Typography variant="h4">{data?.totalBuses || 0}</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Routes</Typography>
              <Typography variant="h4">{data?.totalRoutes || 0}</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Tickets Sold</Typography>
              <Typography variant="h4">{data?.ticketsSold || 0}</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Operators</Typography>
              <Typography variant="h4">{data?.totalOperators || 0}</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Commuters</Typography>
              <Typography variant="h4">{data?.totalCommuters || 0}</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Admins</Typography>
              <Typography variant="h4">{data?.totalAdmins || 0}</Typography>
            </Paper>
          </Grid2>
        </Grid2>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 4 }}
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
