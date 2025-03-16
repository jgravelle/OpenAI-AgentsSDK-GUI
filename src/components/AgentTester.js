import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import apiService from '../utils/apiService';
import TestAgent from './builder/TestAgent';

function AgentTester() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        
        // Get all agents and find the one with matching ID
        const agents = await apiService.getAgents();
        const foundAgent = agents.find(a => a.id === agentId);
        
        if (foundAgent) {
          setAgent(foundAgent);
          setError(null);
        } else {
          setError(`Agent with ID ${agentId} not found`);
        }
      } catch (err) {
        console.error('Error fetching agent:', err);
        setError('Failed to load agent: ' + (err.message || ''));
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgent();
    } else {
      setError('No agent ID provided');
      setLoading(false);
    }
  }, [agentId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1">
          Test Agent
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : agent ? (
        <Paper sx={{ p: 4, borderRadius: 2 }} elevation={2}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {agent.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {agent.description}
            </Typography>
          </Box>
          
          <TestAgent agentData={agent} />
        </Paper>
      ) : (
        <Alert severity="warning">
          Agent not found. Please select an agent from the dashboard.
        </Alert>
      )}
    </Container>
  );
}

export default AgentTester;