import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function AppTheme({ children, disableCustomTheme }) {
  const theme = React.useMemo(() => {
    return createTheme(); // Use default Material-UI theme
  }, []);

  if (disableCustomTheme) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.node.isRequired,
  disableCustomTheme: PropTypes.bool,
};

export default AppTheme;
