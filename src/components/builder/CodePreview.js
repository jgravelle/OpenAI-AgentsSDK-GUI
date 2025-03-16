import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Editor from '@monaco-editor/react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CodeIcon from '@mui/icons-material/Code';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { 
  agentTemplate, 
  runnerTemplate, 
  streamingTemplate 
} from '../../utils/codeTemplates';

function CodePreview({ agentData }) {
  const [tabValue, setTabValue] = useState(0);
  const [copied, setCopied] = useState(false);
  const [agentCode, setAgentCode] = useState('');
  const [runnerCode, setRunnerCode] = useState('');
  const [streamingCode, setStreamingCode] = useState('');

  // Define tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Define memoized functions first to avoid initialization issues
  const generateAgentCode = React.useCallback(() => {
    let code = agentTemplate
      .replace('{{name}}', agentData.name || 'MyAgent')
      .replace('{{instructions}}', agentData.instructions || 'Your instructions here')
      .replace('{{model}}', agentData.model || 'gpt-4o');

    // Format tools
    let toolsStr = '';
    if (agentData.tools && agentData.tools.length > 0) {
      toolsStr = agentData.tools.map(tool => tool.name).join(', ');
    }
    code = code.replace('{{tools}}', toolsStr);

    // Format handoffs
    let handoffsStr = '';
    if (agentData.handoffs && agentData.handoffs.length > 0) {
      handoffsStr = agentData.handoffs.map(handoff => 
        handoff.specialistName || handoff.name
      ).join(', ');
    }
    code = code.replace('{{handoffs}}', handoffsStr);

    setAgentCode(code);
  }, [agentData]);

  const generateRunnerCode = React.useCallback(() => {
    const code = runnerTemplate.replace('{{prompt}}', 'Hello, how can you help me?');
    setRunnerCode(code);
  }, []);

  const generateStreamingCode = React.useCallback(() => {
    const code = streamingTemplate.replace('{{prompt}}', 'Hello, how can you help me?');
    setStreamingCode(code);
  }, []);

  // Use effect to generate code when component mounts or agentData changes
  useEffect(() => {
    // Generate agent code based on user selections
    generateAgentCode();
    generateRunnerCode();
    generateStreamingCode();
  }, [agentData, generateAgentCode, generateRunnerCode, generateStreamingCode]);

  const handleCopyCode = () => {
    let codeToCopy;
    
    switch (tabValue) {
      case 0:
        codeToCopy = agentCode;
        break;
      case 1:
        codeToCopy = runnerCode;
        break;
      case 2:
        codeToCopy = streamingCode;
        break;
      default:
        codeToCopy = agentCode;
    }
    
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadCode = () => {
    let codeToCopy;
    let filename;
    
    switch (tabValue) {
      case 0:
        codeToCopy = agentCode;
        filename = 'agent.py';
        break;
      case 1:
        codeToCopy = runnerCode;
        filename = 'runner.py';
        break;
      case 2:
        codeToCopy = streamingCode;
        filename = 'streaming.py';
        break;
      default:
        codeToCopy = agentCode;
        filename = 'agent.py';
    }
    
    const element = document.createElement('a');
    const file = new Blob([codeToCopy], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Generated Code
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review the generated Python code for your agent. You can copy or download this code to use in your application.
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This code is ready to use with the OpenAI Agents SDK. Make sure you have installed the SDK and configured your API key.
      </Alert>
      
      <Paper sx={{ mb: 3 }} elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Agent Definition" icon={<CodeIcon />} iconPosition="start" />
            <Tab label="Runner" icon={<PlayArrowIcon />} iconPosition="start" />
            <Tab label="Streaming" icon={<PlayArrowIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 0 }}>
          {tabValue === 0 && (
            <Editor
              height="400px"
              language="python"
              theme="light"
              value={agentCode}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          )}
          {tabValue === 1 && (
            <Editor
              height="400px"
              language="python"
              theme="light"
              value={runnerCode}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          )}
          {tabValue === 2 && (
            <Editor
              height="400px"
              language="python"
              theme="light"
              value={streamingCode}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          )}
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1}>
            <Chip label="Python" color="primary" variant="outlined" size="small" />
            <Chip label="OpenAI Agents SDK" variant="outlined" size="small" />
          </Stack>
          
          <Box>
            <Button
              startIcon={copied ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
              onClick={handleCopyCode}
              color={copied ? "success" : "primary"}
              sx={{ mr: 1 }}
            >
              {copied ? "Copied!" : "Copy Code"}
            </Button>
            
            <Button
              startIcon={<FileDownloadIcon />}
              variant="outlined"
              onClick={handleDownloadCode}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="subtitle1" gutterBottom>
        Next Steps
      </Typography>
      <Typography variant="body2" paragraph>
        Test your agent in the next step to make sure it behaves as expected. You can also use this code directly in your application.
      </Typography>
    </Box>
  );
}

export default CodePreview;