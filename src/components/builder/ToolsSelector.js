import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import PublicIcon from '@mui/icons-material/Public';
import DescriptionIcon from '@mui/icons-material/Description';
import ExtensionIcon from '@mui/icons-material/Extension';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Editor from '@monaco-editor/react';

import { builtInTools, exampleFunctionTools } from '../../utils/tools';
import { fullToolExampleTemplate } from '../../utils/codeTemplates';

function ToolsSelector({ agentData, updateAgentData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [toolCode, setToolCode] = useState('');

  const handleAddTool = (tool) => {
    const updatedTools = [...agentData.tools, tool];
    updateAgentData('tools', updatedTools);
  };

  const handleRemoveTool = (toolId) => {
    const updatedTools = agentData.tools.filter(tool => tool.id !== toolId);
    updateAgentData('tools', updatedTools);
  };

  const handleOpenToolDialog = (tool = null) => {
    if (tool) {
      setCurrentTool(tool);
      setToolCode(tool.code || '');
    } else {
      setCurrentTool(null);
      setToolCode(fullToolExampleTemplate);
    }
    setOpenDialog(true);
  };

  const handleCloseToolDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveCustomTool = () => {
    // In a real app, this would validate and save the custom tool
    // For now, we'll just close the dialog
    setOpenDialog(false);
  };

  const getToolIcon = (category) => {
    switch (category) {
      case 'Built-in':
        return <ExtensionIcon />;
      case 'Function':
        return <CodeIcon />;
      case 'Web':
        return <PublicIcon />;
      case 'File':
        return <DescriptionIcon />;
      default:
        return <ExtensionIcon />;
    }
  };

  const filteredBuiltInTools = builtInTools.filter(
    tool => tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFunctionTools = exampleFunctionTools.filter(
    tool => tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agent Tools
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select the tools your agent can use to perform tasks. Tools enable your agent to interact with external systems and APIs.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ height: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                size="small"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                sx={{ flexGrow: 1, mr: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenToolDialog()}
                size="small"
              >
                Custom Tool
              </Button>
            </Box>
            
            <Tabs 
              value={selectedTab} 
              onChange={(_, newValue) => setSelectedTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab label="Built-in Tools" />
              <Tab label="Function Examples" />
            </Tabs>
            
            {selectedTab === 0 && (
              <List>
                {filteredBuiltInTools.map((tool) => {
                  const isAdded = agentData.tools.some(t => t.id === tool.id);
                  
                  return (
                    <ListItem 
                      key={tool.id}
                      className="tool-item"
                      secondaryAction={
                        isAdded ? (
                          <IconButton 
                            edge="end" 
                            aria-label="remove" 
                            color="error"
                            onClick={() => handleRemoveTool(tool.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleAddTool(tool)}
                          >
                            Add
                          </Button>
                        )
                      }
                    >
                      <ListItemIcon>
                        {getToolIcon(tool.category)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {tool.name}
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
                        secondary={tool.description}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
            
            {selectedTab === 1 && (
              <List>
                {filteredFunctionTools.map((tool) => {
                  const isAdded = agentData.tools.some(t => t.id === tool.id);
                  
                  return (
                    <ListItem 
                      key={tool.id}
                      className="tool-item"
                      secondaryAction={
                        <Box>
                          <Tooltip title="View Code">
                            <IconButton
                              edge="end"
                              aria-label="view code"
                              sx={{ mr: 1 }}
                              onClick={() => handleOpenToolDialog(tool)}
                            >
                              <CodeIcon />
                            </IconButton>
                          </Tooltip>
                          
                          {isAdded ? (
                            <IconButton 
                              edge="end" 
                              aria-label="remove" 
                              color="error"
                              onClick={() => handleRemoveTool(tool.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleAddTool(tool)}
                            >
                              Add
                            </Button>
                          )}
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        {getToolIcon(tool.category)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {tool.name}
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
                        secondary={tool.description}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Selected Tools
              </Typography>
              <Tooltip title="Tool usage information">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            {agentData.tools.length === 0 ? (
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
                  No tools selected yet. Add tools from the left panel to enhance your agent's capabilities.
                </Typography>
              </Box>
            ) : (
              <List>
                {agentData.tools.map((tool, index) => (
                  <React.Fragment key={tool.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="remove" 
                          color="error"
                          onClick={() => handleRemoveTool(tool.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        {getToolIcon(tool.category)}
                      </ListItemIcon>
                      <ListItemText
                        primary={tool.name}
                        secondary={tool.category}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Dialog
        open={openDialog}
        onClose={handleCloseToolDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentTool ? `Tool: ${currentTool.name}` : 'Create Custom Tool'}
        </DialogTitle>
        <DialogContent dividers>
          {currentTool && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Description:</Typography>
              <Typography variant="body2" paragraph>
                {currentTool.description}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ height: 400 }}>
            <Editor
              height="100%"
              language="python"
              theme="light"
              value={toolCode}
              onChange={setToolCode}
              options={{
                readOnly: !!currentTool,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseToolDialog}>
            {currentTool ? 'Close' : 'Cancel'}
          </Button>
          {!currentTool && (
            <Button 
              onClick={handleSaveCustomTool} 
              variant="contained"
            >
              Save Tool
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ToolsSelector;