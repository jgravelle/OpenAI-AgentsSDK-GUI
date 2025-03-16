import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// CircularProgress is not used in this file, so we're removing it
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningIcon from '@mui/icons-material/Warning';

import apiService from '../utils/apiService';

function Dashboard() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  
  // Fetch agents when component mounts
  useEffect(() => {
    fetchAgents();
  }, []);
  
  // Function to fetch agents
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const agentData = await apiService.getAgents();
      setAgents(agentData);
      setError(null);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to load agents. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle running an agent
  const handleRunAgent = (agentId) => {
    // Navigate to a test page for this agent
    navigate(`/test/${agentId}`);
  };
  
  // Function to handle editing an agent
  const handleEditAgent = (agentId) => {
    // Navigate to the builder with this agent loaded
    navigate(`/build/${agentId}`);
  };
  
  // Function to handle cloning an agent
  const handleCloneAgent = (agentId) => {
    const agentToClone = agents.find(agent => agent.id === agentId);
    if (agentToClone) {
      // Create a new agent based on the existing one
      const clonedAgent = {
        ...agentToClone,
        name: `${agentToClone.name} (Clone)`,
        id: undefined // Remove ID so a new one will be generated
      };
      
      // Store in session storage for the builder to pick up
      sessionStorage.setItem('agent_to_edit', JSON.stringify(clonedAgent));
      navigate('/build');
    }
  };
  
  // Function to handle deleting an agent
  const handleDeleteAgent = (agentId) => {
    setAgentToDelete(agentId);
    setDeleteDialogOpen(true);
  };
  
  // Function to confirm agent deletion
  const confirmDeleteAgent = async () => {
    if (!agentToDelete) return;
    
    try {
      setLoading(true);
      
      // Call the API to delete the agent
      await apiService.deleteAgent(agentToDelete);
      
      // Remove from local state
      setAgents(agents.filter(agent => agent.id !== agentToDelete));
      
      // Close dialog
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
      setError(null);
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError('Failed to delete agent: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Your Agents
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          size="large"
          onClick={() => navigate('/build')}
        >
          Create Agent
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Loading agents...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {agents.map((agent) => (
          <Grid item xs={12} md={4} key={agent.id}>
            <Card className="card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {agent.name}
                  </Typography>
                  <Chip 
                    label={agent.model} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {agent.description}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  Tools:
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {agent.tools.map((tool, index) => (
                    <Chip
                      key={index}
                      label={tool.name || tool}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
              
              <Divider />
              
              <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                <Button
                  size="small"
                  startIcon={<PlayArrowIcon />}
                  color="primary"
                  onClick={() => handleRunAgent(agent.id)}
                >
                  Run
                </Button>
                
                <Box>
                  <IconButton
                    size="small"
                    color="primary"
                    title="Edit"
                    onClick={() => handleEditAgent(agent.id)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    title="Clone"
                    onClick={() => handleCloneAgent(agent.id)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    title="Delete"
                    onClick={() => handleDeleteAgent(agent.id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardActions>
              
              <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50' }}>
                <Typography variant="caption" color="text.secondary">
                  Last used: {agent.lastUsed}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'grey.300',
              bgcolor: 'background.paper',
            }}
            elevation={0}
          >
            <IconButton
              color="primary"
              sx={{ mb: 2, p: 2, bgcolor: 'primary.light', color: 'white' }}
              onClick={() => navigate('/build')}
            >
              <AddIcon fontSize="large" />
            </IconButton>
            <Typography variant="h6" component="div" align="center">
              Create New Agent
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Build a custom agent with specialized tools
            </Typography>
          </Paper>
        </Grid>
        </Grid>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this agent? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteAgent}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;