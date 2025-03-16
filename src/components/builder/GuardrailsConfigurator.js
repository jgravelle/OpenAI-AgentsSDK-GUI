import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
// import TextField from '@mui/material/TextField'; // Commented out but kept for future use
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import ShieldIcon from '@mui/icons-material/Shield';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Editor from '@monaco-editor/react';
import { guardrailTemplate } from '../../utils/codeTemplates';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function GuardrailsConfigurator({ agentData, updateAgentData }) {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [guardType, setGuardType] = useState('input');
  const [guardrailCode, setGuardrailCode] = useState('');
  const [enabledGuardrails, setEnabledGuardrails] = useState({
    contentFilter: true,
    piiDetection: false,
    toxicityCheck: false,
    jailbreakDetection: true
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenCodeDialog = (type) => {
    setGuardType(type);
    
    // Set a template code for the guardrail
    const template = guardrailTemplate.replace(
      '{{name}}', 
      agentData.name || 'MyAgent'
    ).replace(
      '{{instructions}}', 
      agentData.instructions ? agentData.instructions.substring(0, 40) + '...' : 'Your instructions here'
    );
    
    setGuardrailCode(template);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveGuardrail = () => {
    // In a real app, we would validate and save the guardrail code
    // For now, we'll just close the dialog
    setOpenDialog(false);
  };

  const handleGuardrailToggle = (name) => (event) => {
    setEnabledGuardrails({
      ...enabledGuardrails,
      [name]: event.target.checked
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Guardrails Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure guardrails to ensure your agent operates safely and appropriately. Guardrails can validate both user inputs and agent outputs.
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Input Guardrails" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Output Guardrails" icon={<SecurityOutlinedIcon />} iconPosition="start" />
          <Tab label="Structured Output" icon={<CodeIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Input guardrails validate user inputs before they reach your agent, preventing inappropriate requests or content.
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Predefined Guardrails
              </Typography>
              <FormGroup>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={enabledGuardrails.contentFilter} 
                      onChange={handleGuardrailToggle('contentFilter')}
                    />
                  } 
                  label="Content Filter"
                />
                <Typography variant="caption" color="text.secondary" sx={{ pl: 4, mt: -1, mb: 1 }}>
                  Block harmful, illegal, unethical, or deceptive content
                </Typography>
                
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={enabledGuardrails.jailbreakDetection} 
                      onChange={handleGuardrailToggle('jailbreakDetection')}
                    />
                  } 
                  label="Jailbreak Detection"
                />
                <Typography variant="caption" color="text.secondary" sx={{ pl: 4, mt: -1, mb: 1 }}>
                  Detect and block attempts to bypass agent instructions or limitations
                </Typography>
                
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={enabledGuardrails.piiDetection} 
                      onChange={handleGuardrailToggle('piiDetection')}
                    />
                  } 
                  label="PII Detection"
                />
                <Typography variant="caption" color="text.secondary" sx={{ pl: 4, mt: -1, mb: 1 }}>
                  Identify and handle personally identifiable information in user inputs
                </Typography>
              </FormGroup>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" gutterBottom>
                Custom Input Guardrails
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create custom input validation logic with Python code.
              </Typography>
              
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenCodeDialog('input')}
                >
                  Add Custom Input Guardrail
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Output guardrails validate your agent's responses before they reach the user, ensuring content adheres to guidelines.
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Predefined Output Filters
              </Typography>
              <FormGroup>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={enabledGuardrails.toxicityCheck} 
                      onChange={handleGuardrailToggle('toxicityCheck')}
                    />
                  } 
                  label="Toxicity Check"
                />
                <Typography variant="caption" color="text.secondary" sx={{ pl: 4, mt: -1, mb: 1 }}>
                  Filter out toxic, offensive, or inappropriate responses
                </Typography>
              </FormGroup>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" gutterBottom>
                Custom Output Guardrails
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create custom validation for agent responses.
              </Typography>
              
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenCodeDialog('output')}
                >
                  Add Custom Output Guardrail
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Define structured output types to ensure your agent returns consistently formatted data.
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShieldIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Structured Output Definition
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 3 }}>
                Define a Pydantic model to enforce a specific structure for your agent's responses.
              </Typography>
              
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 3 }}>
                <Editor
                  height="300px"
                  language="python"
                  theme="light"
                  value={`from pydantic import BaseModel

class AgentResponse(BaseModel):
    response: str
    confidence: float = 0.0
    sources: list[str] = []

# Use with:
# agent = Agent(
#     name="Structured Agent",
#     instructions="Provide responses with confidence scores",
#     output_type=AgentResponse,
# )`}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<CodeIcon />}
              >
                Configure Structured Output
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {guardType === 'input' ? 'Custom Input Guardrail' : 'Custom Output Guardrail'}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            Define a custom guardrail function using Python code. Your function should:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label="Return GuardrailFunctionOutput" />
            <Chip label="Set tripwire_triggered to a boolean" />
            <Chip label="Include output_info with relevant details" />
          </Stack>
          
          <Box sx={{ height: 400 }}>
            <Editor
              height="100%"
              language="python"
              theme="light"
              value={guardrailCode}
              onChange={setGuardrailCode}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveGuardrail} 
            variant="contained"
          >
            Save Guardrail
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GuardrailsConfigurator;