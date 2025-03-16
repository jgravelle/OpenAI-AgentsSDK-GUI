import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Tooltip from '@mui/material/Tooltip';

function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="logo"
            sx={{ mr: 2 }}
            component={RouterLink}
            to="/"
          >
            <SmartToyOutlinedIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OpenAI Agent Builder
          </Typography>
          
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            sx={{ mx: 1 }}
          >
            Dashboard
          </Button>
          
          <Button 
            color="primary"
            variant="contained"
            component={RouterLink}
            to="/build"
            sx={{ mx: 1 }}
          >
            Create Agent
          </Button>
          
          <Tooltip title="Toggle Dark Mode">
            <IconButton 
              color="inherit" 
              sx={{ ml: 1 }}
              onClick={toggleDarkMode}
              aria-label="toggle dark mode"
            >
              {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;