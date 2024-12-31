import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Divider } from '@mui/material';

const Sidebar = ({ user }) => {
  return (
    <div style={{ width: '240px', position: 'fixed', top: 0, left: 0, height: '100%', backgroundColor: '#f4f4f4' }}>
      <List>
        {user?.role === 'commuter' && (
          <>
            <ListItem button component={Link} to="/commuter/view-buses">
              <ListItemText primary="View Buses" />
            </ListItem>
            <ListItem button component={Link} to="/commuter/book-tickets">
              <ListItemText primary="Book Tickets" />
            </ListItem>
            <ListItem button component={Link} to="/commuter/view-bookings">
              <ListItemText primary="View Bookings" />
            </ListItem>
          </>
        )}

        {user?.role === 'operator' && (
          <>
            <ListItem button component={Link} to="/operator/manage-buses">
              <ListItemText primary="Manage Buses" />
            </ListItem>
            <ListItem button component={Link} to="/operator/assign-routes">
              <ListItemText primary="Assign Routes" />
            </ListItem>
            <ListItem button component={Link} to="/operator/view-schedules">
              <ListItemText primary="View Schedules" />
            </ListItem>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <ListItem button component={Link} to="/admin/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/admin/manage-users">
              <ListItemText primary="Manage Users" />
            </ListItem>
            <ListItem button component={Link} to="/admin/reports">
              <ListItemText primary="Reports" />
            </ListItem>
            <ListItem button component={Link} to="/admin/settings">
              <ListItemText primary="Settings" />
            </ListItem>
          </>
        )}
      </List>
      <Divider />
    </div>
  );
};

export default Sidebar;
