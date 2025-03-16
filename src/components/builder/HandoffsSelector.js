import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemButton from '@mui/material/ListItemButton'; // Not used but kept for future
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
// import FormControl from '@mui/material/FormControl'; // Not used but kept for future
// import InputLabel from '@mui/material/InputLabel'; // Not used but kept for future
// import Select from '@mui/material/Select'; // Not used but kept for future
// import MenuItem from '@mui/material/MenuItem'; // Not used but kept for future
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit'; // Not used but kept for future
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // Not used but kept for future
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Not used but kept for future

// Sample specialist agents that could be used for handoffs
const sampleSpecialists = [
  {
    id: 'billing',
    name: 'Billing Agent',
    description: 'Handles billing inquiries and payment issues',
    model: 'o3-mini',
    category: 'Support'
  },
  {
    id: 'tech-support',
    name: 'Technical Support',
    description: 'Resolves technical issues and troubleshoots problems',
    model: 'gpt-4o',
    category: 'Support'
  },
  {
    id: 'refunds',
    name: 'Refund Specialist',
    description: 'Processes refund requests and handles related inquiries',
    model: 'o3-mini',
    category: 'Support'
  },
  {
    id: 'spanish',
    name: 'Spanish Translator',
    description: 'Translates content to Spanish',
    model: 'o3-mini',
    category: 'Language'
  },
  {
    id: 'french',
    name: 'French Translator',
    description: 'Translates content to French',
    model: 'o3-mini',
    category: 'Language'
  }
];

function HandoffsSelector({ agentData, updateAgentData }) {
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedSpecialist, setSelectedSpecialist] = useState(null); // Commented out for now, but kept for future use
  const [openDialog, setOpenDialog] = useState(false);
  const [newHandoff, setNewHandoff] = useState({
    id: '',
    name: '',
    toolName: '',
    description: ''
  });

  const handleAddHandoff = (specialist) => {
    // Format the handoff based on the selected specialist
    const handoff = {
      id: specialist.id,
      specialistId: specialist.id,
      specialistName: specialist.name,
      toolName: `escalate_to_${specialist.id.replace(/\s+/g, '_').toLowerCase()}`,
      description: `Escalate to ${specialist.name} for specialized assistance`
    };
    
    const updatedHandoffs = [...agentData.handoffs, handoff];
    updateAgentData('handoffs', updatedHandoffs);
  };

  const handleRemoveHandoff = (handoffId) => {
    const updatedHandoffs = agentData.handoffs.filter(handoff => handoff.id !== handoffId);
    updateAgentData('handoffs', updatedHandoffs);
  };

  const handleOpenNewHandoffDialog = () => {
    setNewHandoff({
      id: `handoff-${Date.now()}`,
      name: '',
      toolName: '',
      description: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // setSelectedSpecialist(null); // Commented out since variable is not currently used
  };

  const handleSaveHandoff = () => {
    if (newHandoff.name && newHandoff.toolName) {
      const handoff = {
        ...newHandoff,
        toolName: newHandoff.toolName.replace(/\s+/g, '_').toLowerCase()
      };
      
      const updatedHandoffs = [...agentData.handoffs, handoff];
      updateAgentData('handoffs', updatedHandoffs);
      setOpenDialog(false);
    }
  };

  const filteredSpecialists = sampleSpecialists.filter(
    specialist => specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  specialist.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group specialists by category
  const groupedSpecialists = filteredSpecialists.reduce((acc, specialist) => {
    if (!acc[specialist.category]) {
      acc[specialist.category] = [];
    }
    acc[specialist.category].push(specialist);
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agent Handoffs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure handoffs to specialist agents for specific tasks. Handoffs allow your main agent to delegate complex inquiries to specialized agents.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ height: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                size="small"
                placeholder="Search specialists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1, mr: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenNewHandoffDialog}
                size="small"
              >
                Custom Handoff
              </Button>
            </Box>
            
            {Object.entries(groupedSpecialists).map(([category, specialists]) => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                  {category} Specialists
                </Typography>
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                  {specialists.map((specialist) => {
                    const isAdded = agentData.handoffs.some(h => h.specialistId === specialist.id);
                    
                    return (
                      <ListItem 
                        key={specialist.id}
                        className="tool-item"
                        secondaryAction={
                          isAdded ? (
                            <IconButton 
                              edge="end" 
                              aria-label="remove" 
                              color="error"
                              onClick={() => handleRemoveHandoff(specialist.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleAddHandoff(specialist)}
                            >
                              Add
                            </Button>
                          )
                        }
                      >
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {specialist.name}
                              {isAdded && (
                                <Chip 
                                  label="Added" 
                                  color="primary" 
                                  size="small" 
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              {specialist.description}
                              <Chip 
                                label={specialist.model} 
                                size="small" 
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            </>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            ))}
            
            {Object.keys(groupedSpecialists).length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No specialists found matching your search.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Active Handoffs
            </Typography>
            
            {agentData.handoffs.length === 0 ? (
              <Box 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  border: '1px dashed', 
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No handoffs configured yet. Add specialists from the left panel to enable your agent to delegate tasks.
                </Typography>
              </Box>
            ) : (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Your agent will automatically determine when to use these handoffs.
                  </Typography>
                </Alert>
                
                <List>
                  {agentData.handoffs.map((handoff, index) => (
                    <React.Fragment key={handoff.id}>
                      {index > 0 && <Divider />}
                      <ListItem
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            aria-label="remove" 
                            color="error"
                            onClick={() => handleRemoveHandoff(handoff.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <ArrowForwardIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={handoff.specialistName || handoff.name}
                          secondary={`Tool name: ${handoff.toolName}`}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Create Custom Handoff
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specialist Name"
                value={newHandoff.name}
                onChange={(e) => setNewHandoff({...newHandoff, name: e.target.value})}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tool Name"
                value={newHandoff.toolName}
                onChange={(e) => setNewHandoff({...newHandoff, toolName: e.target.value})}
                helperText="This will be the name of the handoff tool used by the agent"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newHandoff.description}
                onChange={(e) => setNewHandoff({...newHandoff, description: e.target.value})}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveHandoff} 
            variant="contained"
            disabled={!newHandoff.name || !newHandoff.toolName}
          >
            Add Handoff
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HandoffsSelector;