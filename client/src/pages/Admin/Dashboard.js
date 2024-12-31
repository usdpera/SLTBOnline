import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import axiosInstance from '../../services/axiosInstance'; // Assuming this service exists for API calls

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuses: 0,
    totalRoutes: 0,
    totalTicketsSold: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch statistics from API on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/admin/dashboard-stats'); // Update this with the actual endpoint
        setStats(response.data); // Assuming API returns an object with the stats
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Users
                </Typography>
                <Typography variant="h4" color="primary">
                  {stats.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Buses
                </Typography>
                <Typography variant="h4" color="primary">
                  {stats.totalBuses}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Routes
                </Typography>
                <Typography variant="h4" color="primary">
                  {stats.totalRoutes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Tickets Sold
                </Typography>
                <Typography variant="h4" color="primary">
                  {stats.totalTicketsSold}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Dashboard;
