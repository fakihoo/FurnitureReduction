import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from './Theme/DarkTheme';
import { CssBaseline } from '@mui/material';
import { Navbar } from './component/Navbar/Navbar';
import CustomerRouting from './component/Routes/CustomerRouting';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <CustomerRouting /> 
    </ThemeProvider>
  );
}

export default App;
