import React, { useState, useRef, useEffect } from 'react';
import apiService from '../../utils/apiService';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function TestAgent({ agentData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Check if API key exists
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        throw new Error('No API key found. Please set your OpenAI API key in the settings.');
      }
      
      // Add a processing message
      const processingMessage = {
        id: Date.now() + 0.1,
        role: 'system',
        content: 'Processing your request...'
      };
      setMessages(prev => [...prev, processingMessage]);
      
      // If we have an agent ID (saved agent), use it
      if (agentData.id) {
        console.log(`Running agent with ID: ${agentData.id}`);
        const response = await apiService.runAgent(agentData.id, input);
        
        // Remove the processing message
        setMessages(prev => prev.filter(m => m.id !== processingMessage.id));
        
        processAgentResponse(response);
      } else {
        // For unsaved agents, create a temporary agent
        console.log('Creating temporary agent...');
        const tempAgent = await apiService.createAgent(agentData);
        console.log(`Created temporary agent with ID: ${tempAgent.id}`);
        
        const response = await apiService.runAgent(tempAgent.id, input);
        
        // Remove the processing message
        setMessages(prev => prev.filter(m => m.id !== processingMessage.id));
        
        processAgentResponse(response);
      }
    } catch (error) {
      console.error('Error running agent:', error);
      
      // Remove any processing message
      setMessages(prev => prev.filter(m => m.content === 'Processing your request...'));
      
      // Handle errors
      const errorMessage = {
        id: Date.now(),
        role: 'system',
        content: `Error: ${error.message || 'Failed to get response from agent'}`
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };
  
  /**
   * Process an agent response from the OpenAI Agents SDK
   */
  const processAgentResponse = (response) => {
    console.log('Processing agent response:', response);
    
    // Process tool calls if present
    if (response.new_items) {
      for (const item of response.new_items) {
        if (item.type === "tool_call_item") {
          // Add tool call message
          const toolCallMessage = {
            id: Date.now() + Math.random(),
            role: 'assistant',
            type: 'tool_call',
            tool: item.raw_item.name,
            content: `Using ${item.raw_item.name}...`
          };
          
          // Add tool result message
          const toolResultMessage = {
            id: Date.now() + Math.random(),
            role: 'tool',
            tool: item.raw_item.name,
            content: item.output || 'Tool execution completed'
          };
          
          setMessages(prev => [...prev, toolCallMessage, toolResultMessage]);
        }
      }
    }
    
    // Add the final assistant response
    let content = 'No response generated';
    
    if (typeof response.output === 'string') {
      content = response.output;
    } else if (response.final_output) {
      // Handle SDK's final_output
      if (typeof response.final_output === 'string') {
        content = response.final_output;
      } else if (typeof response.final_output === 'object') {
        content = JSON.stringify(response.final_output, null, 2);
      }
    } else if (response.output?.content) {
      content = response.output.content;
    } else if (response.output?.text) {
      content = response.output.text;
    } else if (response.content) {
      content = response.content;
    } else if (typeof response === 'string') {
      content = response;
    }
    
    const assistantMessage = {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: content
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  // Render messages with appropriate styling based on role
  const renderMessage = (message) => {
    switch (message.role) {
      case 'user':
        return (
          <ListItem key={message.id} sx={{ justifyContent: 'flex-end' }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '12px 12px 0 12px',
                maxWidth: '80%'
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
          </ListItem>
        );
        
      case 'assistant':
        if (message.type === 'tool_call') {
          return (
            <ListItem key={message.id}>
              <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                <SmartToyOutlinedIcon />
              </Avatar>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px 12px 12px 0',
                  maxWidth: '80%'
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Using tool: {message.tool}
                </Typography>
                <Typography variant="body1">{message.content}</Typography>
              </Paper>
            </ListItem>
          );
        }
        
        return (
          <ListItem key={message.id}>
            <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
              <SmartToyOutlinedIcon />
            </Avatar>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px 12px 12px 0',
                maxWidth: '80%'
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
          </ListItem>
        );
        
      case 'tool':
        return (
          <ListItem key={message.id}>
            <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
              <InsertDriveFileOutlinedIcon />
            </Avatar>
            <Paper
              sx={{
                p: 2,
                bgcolor: theme => theme.palette.mode === 'dark' ? 'background.paper' : 'info.50',
                border: '1px solid',
                borderColor: theme => theme.palette.mode === 'dark' ? 'divider' : 'info.200',
                borderRadius: '12px 12px 12px 0',
                maxWidth: '80%'
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tool result: {message.tool}
              </Typography>
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
          </ListItem>
        );
        
      case 'specialist':
        return (
          <ListItem key={message.id}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
              <PersonOutlineIcon />
            </Avatar>
            <Paper
              sx={{
                p: 2,
                bgcolor: theme => theme.palette.mode === 'dark' ? 'background.paper' : 'secondary.50',
                border: '1px solid',
                borderColor: theme => theme.palette.mode === 'dark' ? 'divider' : 'secondary.200',
                borderRadius: '12px 12px 12px 0',
                maxWidth: '80%'
              }}
            >
              <Typography variant="body2" color="secondary" fontWeight="bold" gutterBottom>
                {message.name}
              </Typography>
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
          </ListItem>
        );
        
      case 'system':
        return (
          <ListItem key={message.id} sx={{ justifyContent: 'center' }}>
            <Paper
              sx={{
                py: 1,
                px: 2,
                bgcolor: theme => theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100',
                border: '1px solid',
                borderColor: theme => theme.palette.mode === 'dark' ? 'divider' : 'grey.300',
                borderRadius: '12px',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {message.content}
              </Typography>
            </Paper>
          </ListItem>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Test Your Agent
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Test how your agent responds to different inputs. This environment uses the OpenAI Agents SDK to provide real responses based on your agent configuration.
      </Typography>
      
      <Paper sx={{ mb: 3 }} elevation={3}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center' }}>
          <SmartToyOutlinedIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            {agentData.name || 'Agent'} - Test Chat
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="small"
            color="inherit"
            onClick={handleClearChat}
            title="Clear chat"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Box
          sx={{
            height: 400,
            overflowY: 'auto',
            bgcolor: theme => theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
            p: 2
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              <SmartToyOutlinedIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
              <Typography variant="body1" gutterBottom>
                No messages yet
              </Typography>
              <Typography variant="body2">
                Start a conversation to test your agent
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ReplayIcon />}
                sx={{ mt: 2 }}
                onClick={() => {
                  setInput("Hi! What can you help me with?");
                }}
              >
                Suggest a prompt
              </Button>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {messages.map(message => renderMessage(message))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2, display: 'flex' }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            size="small"
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            sx={{ minWidth: 0, p: 1 }}
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </Button>
        </Box>
      </Paper>
      
      <Alert severity="info">
        <Typography variant="body2">
          This test environment connects to the OpenAI API using the Agents SDK and your API key. For saved agents, you'll get real responses from the SDK. For unsaved agents, a temporary agent will be created.
        </Typography>
      </Alert>
    </Box>
  );
}

export default TestAgent;