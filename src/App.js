import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import AgentBuilder from './components/AgentBuilder';
import AgentTester from './components/AgentTester';
import Navbar from './components/Navbar';
import ApiKeySetup from './components/ApiKeySetup';

function App() {
  const [apiKeySet, setApiKeySet] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage for saved preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Save dark mode preference to local storage when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Create theme based on dark mode preference
  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#10A37F',
        },
        secondary: {
          main: '#0D8A6F',
        },
        background: {
          default: darkMode ? '#121212' : '#F7F7F8',
          paper: darkMode ? '#1E1E1E' : '#FFFFFF',
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      shape: {
        borderRadius: 8,
      },
    }), [darkMode]);

  if (!apiKeySet) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApiKeySetup onApiKeySet={() => setApiKeySet(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/build" element={<AgentBuilder />} />
        <Route path="/build/:agentId" element={<AgentBuilder />} />
        <Route path="/test/:agentId" element={<AgentTester />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;