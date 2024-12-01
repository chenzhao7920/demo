import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container component="main" maxWidth="xs" style={{ textAlign: 'center', marginTop: '100px' }}>
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          The page you’re looking for doesn’t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/auth/signin"
          sx={{ mt: 3, backgroundColor: '#1976d2' }}
        >
          Go to Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
