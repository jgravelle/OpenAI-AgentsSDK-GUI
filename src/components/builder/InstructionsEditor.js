import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Editor from '@monaco-editor/react';
import CodeIcon from '@mui/icons-material/Code';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// Example templates for instruction prompts
const instructionTemplates = [
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Handle customer inquiries, troubleshoot issues, and provide helpful responses',
    content: `You are a friendly customer support agent. Your goal is to help users with their inquiries about our products and services.

Follow these guidelines:
1. Be polite and professional at all times
2. Ask clarifying questions if the user's request is unclear
3. Provide concise, accurate information
4. Acknowledge when you don't know an answer
5. Use the tools available to you to lookup information when needed
6. Maintain a consistent, helpful tone throughout the conversation

You can handle:
- Product information requests
- Troubleshooting common issues
- Account management questions
- Billing inquiries
- General company information

If a request is complex or requires specialized knowledge, use the appropriate handoff to direct the user to a specialist.`
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Produce engaging content following specific brand guidelines and tone',
    content: `You are a creative content writer for the brand. Your job is to create engaging, informative content that aligns with our brand voice and resonates with our audience.

Follow these guidelines:
1. Write in a conversational, approachable tone
2. Use clear, concise language that's easy to understand
3. Include engaging hooks and introductions
4. Incorporate relevant keywords naturally
5. Structure content with appropriate headings and sections
6. Back up claims with data and examples when possible

Brand voice:
- Friendly but professional
- Authoritative but not condescending
- Innovative and forward-thinking
- Inclusive and accessible

When writing, focus on providing value to the reader. Avoid overly promotional language and prioritize educational, insightful content.`
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyze data, provide insights, and generate visualizations',
    content: `You are a data analyst assistant. Your role is to help users analyze and interpret data, providing clear insights and recommendations.

Follow these guidelines:
1. Ask for clarification about data sources and specific analysis needs
2. Provide objective, data-driven insights
3. Explain your methodology and reasoning
4. Present findings in clear, concise language
5. Suggest visualizations when appropriate
6. Highlight limitations in the data or analysis

When analyzing data:
- Consider statistical significance
- Look for trends and patterns
- Identify outliers and anomalies
- Consider contextual factors
- Provide actionable insights when possible

Avoid making claims that aren't supported by the data. If certain conclusions can't be drawn from the available information, clearly communicate these limitations.`
  }
];

function InstructionsEditor({ agentData, updateAgentData }) {
  const [editorMode, setEditorMode] = useState('text');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleInstructionsChange = (value) => {
    updateAgentData('instructions', value);
  };

  const applyTemplate = (template) => {
    updateAgentData('instructions', template.content);
    setShowTemplates(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agent Instructions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define how your agent should behave and respond to user inputs. These instructions serve as the system prompt for your agent.
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Clear, detailed instructions help your agent respond appropriately. Include specific guidance about tone, limitations, and how to handle different types of requests.
      </Alert>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={editorMode}
          exclusive
          onChange={(_, newMode) => newMode && setEditorMode(newMode)}
          size="small"
        >
          <ToggleButton value="text">
            <TextFormatIcon sx={{ mr: 1 }} />
            Text
          </ToggleButton>
          <ToggleButton value="code">
            <CodeIcon sx={{ mr: 1 }} />
            Code
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Chip 
          icon={<FormatListBulletedIcon />} 
          label="Use Template" 
          clickable
          color={showTemplates ? "primary" : "default"}
          onClick={() => setShowTemplates(!showTemplates)}
        />
      </Box>
      
      {showTemplates && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Instruction Templates
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {instructionTemplates.map((template) => (
              <Paper
                key={template.id}
                sx={{ 
                  p: 2, 
                  flexBasis: 'calc(33.33% - 16px)',
                  flexGrow: 0,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 2
                  }
                }}
                onClick={() => applyTemplate(template)}
              >
                <Typography variant="subtitle2">{template.name}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {template.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
      
      <Box sx={{ height: 400, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        {editorMode === 'text' ? (
          <TextField
            fullWidth
            multiline
            value={agentData.instructions}
            onChange={(e) => handleInstructionsChange(e.target.value)}
            placeholder="Enter detailed instructions for your agent..."
            variant="outlined"
            sx={{ 
              height: '100%',
              '& .MuiOutlinedInput-root': {
                height: '100%',
                alignItems: 'flex-start'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiInputBase-input': {
                height: '100%',
                overflowY: 'auto'
              }
            }}
          />
        ) : (
          <Editor
            height="100%"
            language="markdown"
            theme="light"
            value={agentData.instructions}
            onChange={handleInstructionsChange}
            options={{
              minimap: { enabled: false },
              lineNumbers: 'on',
              wordWrap: 'on',
              wrappingIndent: 'indent',
              scrollBeyondLastLine: false,
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default InstructionsEditor;