import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { modelOptions } from '../../utils/modelOptions';

function BasicDetails({ agentData, updateAgentData }) {
  const handleModelSettingChange = (setting, value) => {
    updateAgentData('modelSettings', {
      ...agentData.modelSettings,
      [setting]: value
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agent Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure the basic details and model settings for your agent.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agent Name"
            value={agentData.name}
            onChange={(e) => updateAgentData('name', e.target.value)}
            placeholder="e.g., Customer Support Agent"
            helperText="A descriptive name for your agent"
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Model</InputLabel>
            <Select
              value={agentData.model}
              onChange={(e) => updateAgentData('model', e.target.value)}
              label="Model"
            >
              {modelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box>
                    <Typography variant="body1">{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Agent Description"
            value={agentData.description}
            onChange={(e) => updateAgentData('description', e.target.value)}
            placeholder="e.g., Handles customer inquiries and routes to specialists when needed"
            helperText="A brief description of what this agent does"
            multiline
            rows={2}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Model Settings
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ px: 2 }}>
            <Typography variant="body2" gutterBottom>
              Temperature
              <Tooltip title="Controls randomness. Lower values make responses more focused and deterministic, higher values make responses more creative and varied.">
                <InfoOutlinedIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', color: 'text.secondary' }} />
              </Tooltip>
            </Typography>
            <Slider
              value={agentData.modelSettings.temperature}
              onChange={(_, value) => handleModelSettingChange('temperature', value)}
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ px: 2 }}>
            <Typography variant="body2" gutterBottom>
              Top P
              <Tooltip title="Controls diversity. Lower values make the model focus on higher probability tokens, higher values allow more diverse options.">
                <InfoOutlinedIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', color: 'text.secondary' }} />
              </Tooltip>
            </Typography>
            <Slider
              value={agentData.modelSettings.topP}
              onChange={(_, value) => handleModelSettingChange('topP', value)}
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Frequency Penalty"
            type="number"
            value={agentData.modelSettings.frequencyPenalty}
            onChange={(e) => handleModelSettingChange('frequencyPenalty', parseFloat(e.target.value))}
            InputProps={{
              inputProps: { min: -2, max: 2, step: 0.1 },
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Penalizes repetition. Positive values decrease the likelihood of repeating the same words.">
                    <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Presence Penalty"
            type="number"
            value={agentData.modelSettings.presencePenalty}
            onChange={(e) => handleModelSettingChange('presencePenalty', parseFloat(e.target.value))}
            InputProps={{
              inputProps: { min: -2, max: 2, step: 0.1 },
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Encourages talking about new topics. Positive values increase the likelihood of introducing new concepts.">
                    <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default BasicDetails;