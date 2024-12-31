import React from 'react';
import { Button } from '@mui/material';

const Header = ({ user }) => {
  return (
    <header style={{ padding: '10px', backgroundColor: '#3f51b5', color: 'white' }}>
      <h1>SLTBOnline</h1>
      {user && (
        <div>
          <span>{user.name}</span>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            style={{ marginLeft: '10px' }}
          >
            Logout
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
