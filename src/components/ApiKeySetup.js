import React, { useState } from 'react';
import apiService from '../utils/apiService';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import KeyIcon from '@mui/icons-material/Key';

function ApiKeySetup({ onApiKeySet }) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim() || !apiKey.startsWith('sk-')) {
      setError('Please enter a valid OpenAI API key starting with "sk-"');
      return;
    }
    
    try {
      setIsValidating(true);
      setError('');
      
      // Validate the API key with OpenAI
      await apiService.validateApiKey(apiKey);
      
      // If validation succeeds, save the key and continue
      localStorage.setItem('openai_api_key', apiKey);
      onApiKeySet();
    } catch (error) {
      setError(error.message || 'Failed to validate API key. Please check your key and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
        elevation={3}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          color: 'primary.main'
        }}>
          <SmartToyOutlinedIcon sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h4" component="h1">
            Agent Builder
          </Typography>
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Welcome to OpenAI Agent Builder
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
          To get started, please enter your OpenAI API key.
          This will be stored locally and used to interact with the OpenAI API.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="OpenAI API Key"
            variant="outlined"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            InputProps={{
              startAdornment: <KeyIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isValidating}
            sx={{ py: 1.5 }}
          >
            {isValidating ? 'Validating...' : 'Continue'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ApiKeySetup;