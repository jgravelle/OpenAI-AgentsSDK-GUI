import React, { useState, useEffect } from 'react';
import apiService from '../utils/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';

import BasicDetails from './builder/BasicDetails';
import InstructionsEditor from './builder/InstructionsEditor';
import ToolsSelector from './builder/ToolsSelector';
import HandoffsSelector from './builder/HandoffsSelector';
import GuardrailsConfigurator from './builder/GuardrailsConfigurator';
import CodePreview from './builder/CodePreview';
import TestAgent from './builder/TestAgent';

const steps = [
  'Basic Details',
  'Instructions',
  'Tools',
  'Handoffs',
  'Guardrails',
  'Code Preview',
  'Test Agent'
];

function AgentBuilder() {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    model: 'gpt-4o',
    instructions: 'You are a helpful assistant.',
    modelSettings: {
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    tools: [],
    handoffs: [],
    inputGuardrails: [],
    outputGuardrails: [],
    outputType: null
  });
  
  // Load agent data if editing an existing agent
  useEffect(() => {
    const loadAgentData = async () => {
      // Check if we have an agent ID from the URL
      if (agentId) {
        try {
          setLoading(true);
          
          // Get all agents and find the one with matching ID
          const agents = await apiService.getAgents();
          const foundAgent = agents.find(a => a.id === agentId);
          
          if (foundAgent) {
            setAgentData(foundAgent);
            setError(null);
          } else {
            setError(`Agent with ID ${agentId} not found`);
          }
        } catch (err) {
          console.error('Error loading agent:', err);
          setError('Failed to load agent: ' + (err.message || ''));
        } finally {
          setLoading(false);
        }
      } else {
        // Check if we have agent data in session storage (for cloning)
        const storedAgentData = sessionStorage.getItem('agent_to_edit');
        if (storedAgentData) {
          try {
            const parsedData = JSON.parse(storedAgentData);
            setAgentData(parsedData);
            // Clear the session storage after loading
            sessionStorage.removeItem('agent_to_edit');
          } catch (err) {
            console.error('Error parsing stored agent data:', err);
          }
        }
      }
    };
    
    loadAgentData();
  }, [agentId]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const updateAgentData = (field, value) => {
    setAgentData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Save the agent using the API service
      let savedAgent;
      
      if (agentId) {
        // Update existing agent
        savedAgent = await apiService.updateAgent(agentId, agentData);
        console.log("Agent updated successfully:", savedAgent);
      } else {
        // Create new agent
        savedAgent = await apiService.createAgent(agentData);
        console.log("Agent created successfully:", savedAgent);
      }
      
      // Navigate back to dashboard
      navigate('/');
    } catch (error) {
      console.error("Error saving agent:", error);
      setError("Failed to save agent: " + (error.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicDetails 
            agentData={agentData} 
            updateAgentData={updateAgentData} 
          />
        );
      case 1:
        return (
          <InstructionsEditor 
            agentData={agentData} 
            updateAgentData={updateAgentData} 
          />
        );
      case 2:
        return (
          <ToolsSelector 
            agentData={agentData} 
            updateAgentData={updateAgentData} 
          />
        );
      case 3:
        return (
          <HandoffsSelector 
            agentData={agentData} 
            updateAgentData={updateAgentData} 
          />
        );
      case 4:
        return (
          <GuardrailsConfigurator 
            agentData={agentData} 
            updateAgentData={updateAgentData} 
          />
        );
      case 5:
        return (
          <CodePreview 
            agentData={agentData} 
          />
        );
      case 6:
        return (
          <TestAgent 
            agentData={agentData} 
          />
        );
      default:
        return 'Unknown step';
    }
  };

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
          {agentId ? 'Edit Agent' : 'Create Agent'}
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
      ) : (
        <Paper sx={{ p: 4, borderRadius: 2 }} elevation={2}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box>
            {getStepContent(activeStep)}
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      {agentId ? 'Update Agent' : 'Save Agent'}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => {
                        handleSave().then(() => {
                          if (agentId) {
                            navigate(`/test/${agentId}`);
                          }
                        });
                      }}
                      disabled={loading}
                    >
                      Save & Run
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={activeStep === steps.length - 2 ? <CodeIcon /> : null}
                  >
                    {activeStep === steps.length - 2 ? 'Generate Code' : 'Next'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default AgentBuilder;