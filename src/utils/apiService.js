// Import the OpenAI Agents SDK
import { OpenAI, OpenAIAgent } from 'openai-agents';

// Local storage keys
const STORAGE_KEY_AGENTS = 'openai_agents';
const STORAGE_KEY_API_KEY = 'openai_api_key';

class ApiService {
  constructor() {
    // Initialize local storage for agents if not exists
    if (!localStorage.getItem(STORAGE_KEY_AGENTS)) {
      localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify([]));
    }
    
    // Set up the OpenAI API key from local storage
    this.setupApiKey();
  }
  
  /**
   * Set up the OpenAI API key from local storage
   */
  setupApiKey() {
    const apiKey = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (apiKey) {
      // Initialize OpenAI client with the API key
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for browser usage
      });
    }
  }

  /**
   * Create a new agent
   * @param {Object} agentData - The agent configuration
   * @returns {Promise<Object>} - The created agent
   */
  async createAgent(agentData) {
    try {
      // Create an OpenAIAgent instance
      const agent = new OpenAIAgent({
        name: agentData.name,
        instructions: agentData.instructions,
        model: agentData.model || 'gpt-4o',
        // Note: OpenAIAgent has a different API than the original Agent class
        // We're simplifying here and will need to adapt as needed
      });
      
      // Convert the Agent instance to our internal format
      const createdAgent = this._convertAgentToInternalFormat(agent, agentData);
      
      // Save to local storage
      this._saveAgentToLocalStorage(createdAgent);
      
      return createdAgent;
    } catch (error) {
      console.error('Error creating agent:', error);
      
      // If SDK calls fail, create a local-only agent
      const localAgent = this._createLocalAgent(agentData);
      this._saveAgentToLocalStorage(localAgent);
      
      return localAgent;
    }
  }
  
  /**
   * Update an existing agent
   * @param {string} agentId - The ID of the agent to update
   * @param {Object} agentData - The updated agent configuration
   * @returns {Promise<Object>} - The updated agent
   */
  async updateAgent(agentId, agentData) {
    try {
      // Create an updated OpenAIAgent instance
      const agent = new OpenAIAgent({
        name: agentData.name,
        instructions: agentData.instructions,
        model: agentData.model || 'gpt-4o',
        // Note: OpenAIAgent has a different API than the original Agent class
        // We're simplifying here and will need to adapt as needed
      });
      
      // Convert the Agent instance to our internal format and preserve the ID
      const updatedAgent = {
        ...this._convertAgentToInternalFormat(agent, agentData),
        id: agentId,
        updated_at: new Date().toISOString()
      };
      
      // Save to local storage
      this._saveAgentToLocalStorage(updatedAgent);
      
      return updatedAgent;
    } catch (error) {
      console.error('Error updating agent:', error);
      
      // If SDK calls fail, update in local storage only
      const updatedAgent = {
        ...agentData,
        id: agentId,
        updated_at: new Date().toISOString()
      };
      
      this._saveAgentToLocalStorage(updatedAgent);
      
      return updatedAgent;
    }
  }
  
  /**
   * Get all agents
   * @returns {Promise<Array>} - List of agents
   */
  async getAgents() {
    // Return agents from local storage
    return this._getAgentsFromLocalStorage();
  }
  
  /**
   * Delete an agent
   * @param {string} agentId - The ID of the agent to delete
   * @returns {Promise<boolean>} - Whether the deletion was successful
   */
  async deleteAgent(agentId) {
    try {
      // Remove from local storage
      const agents = this._getAgentsFromLocalStorage();
      const updatedAgents = agents.filter(agent => agent.id !== agentId);
      localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(updatedAgents));
      
      return true;
    } catch (error) {
      console.error('Error deleting agent:', error);
      return false;
    }
  }
  
  /**
   * Run an agent with the provided input
   * @param {string} agentId - The ID of the agent to run
   * @param {string|Array} input - The input message or conversation history
   * @returns {Promise<Object>} - The run result
   */
  async runAgent(agentId, input) {
    // Format the input based on whether it's a string or array
    const formattedInput = typeof input === 'string'
      ? input
      : input[input.length - 1].content; // Use the last message content
    
    // Check if we have a valid API key before proceeding
    const apiKey = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (!apiKey) {
      throw new Error('No API key found. Please set your OpenAI API key in the settings.');
    }
    
    try {
      // Get the agent from local storage
      const agents = this._getAgentsFromLocalStorage();
      const agentData = agents.find(a => a.id === agentId);
      
      if (!agentData) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Initialize OpenAI client if not already done
      if (!this.openai) {
        this.openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });
      }
      
      // Prepare tools if the agent has any
      const tools = this._createToolsFromConfig(agentData.tools || []);
      
      // Create a chat completion using the OpenAI API
      const messages = [
        { role: 'system', content: agentData.instructions },
        { role: 'user', content: formattedInput }
      ];
      
      // Create the API request
      const requestOptions = {
        model: agentData.model || 'gpt-4o',
        messages: messages,
        temperature: agentData.modelSettings?.temperature || 0.7,
        top_p: agentData.modelSettings?.topP || 1,
        frequency_penalty: agentData.modelSettings?.frequencyPenalty || 0,
        presence_penalty: agentData.modelSettings?.presencePenalty || 0,
      };
      
      // Add tools if available
      if (tools.length > 0) {
        requestOptions.tools = tools;
        requestOptions.tool_choice = 'auto';
      }
      
      // Make the API call
      const response = await this.openai.chat.completions.create(requestOptions);
      
      // Process the response
      const responseMessage = response.choices[0].message;
      let finalOutput = responseMessage.content || '';
      const newItems = [];
      
      // Handle tool calls if present
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        // Process each tool call
        for (const toolCall of responseMessage.tool_calls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);
          
          // Add tool call to new items
          newItems.push({
            type: 'tool_call_item',
            raw_item: {
              name: toolName,
              arguments: toolCall.function.arguments
            }
          });
          
          // Handle different tools
          let toolResult = '';
          if (toolName === 'web_search') {
            // Provide realistic simulated web search results for weather queries
            const query = toolArgs.query.toLowerCase();
            
            if (query.includes('weather') || query.includes('temperature') || query.includes('forecast')) {
              // Extract location from query
              let location = 'the requested location';
              const locationMatch = query.match(/(?:weather|temperature|forecast)(?:\s+in|\s+for|\s+at)?\s+([a-zA-Z\s,]+)/i);
              if (locationMatch && locationMatch[1]) {
                location = locationMatch[1].trim();
              }
              
              // Generate realistic weather data
              const currentDate = new Date();
              const temperature = Math.floor(Math.random() * 30) + 40; // Random temp between 40-70°F
              const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 5)];
              const humidity = Math.floor(Math.random() * 50) + 30; // Random humidity between 30-80%
              const windSpeed = Math.floor(Math.random() * 20) + 5; // Random wind speed between 5-25 mph
              
              toolResult = `Weather search results for "${location}":\n\n` +
                `Current Weather for ${location} (as of ${currentDate.toLocaleTimeString()}):\n` +
                `- Temperature: ${temperature}°F\n` +
                `- Conditions: ${conditions}\n` +
                `- Humidity: ${humidity}%\n` +
                `- Wind Speed: ${windSpeed} mph\n\n` +
                `5-Day Forecast for ${location}:\n` +
                `- Today: ${conditions}, High ${temperature}°F, Low ${temperature-10}°F\n` +
                `- Tomorrow: ${['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 5)]}, High ${temperature+2}°F, Low ${temperature-8}°F\n` +
                `- Day 3: ${['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 5)]}, High ${temperature-5}°F, Low ${temperature-15}°F\n` +
                `- Day 4: ${['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 5)]}, High ${temperature+4}°F, Low ${temperature-6}°F\n` +
                `- Day 5: ${['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 5)]}, High ${temperature+1}°F, Low ${temperature-9}°F\n\n` +
                `Source: Simulated Weather Data (for demonstration purposes)`;
            } else {
              // Generic search results for non-weather queries
              toolResult = `Search results for "${toolArgs.query}":\n\n` +
                `1. ${toolArgs.query} - Wikipedia\n   Summary: Information about ${toolArgs.query} from the free encyclopedia...\n\n` +
                `2. Latest news on ${toolArgs.query} - News Source\n   Summary: Recent developments related to ${toolArgs.query}...\n\n` +
                `3. Understanding ${toolArgs.query} - Educational Resource\n   Summary: Comprehensive guide to understanding ${toolArgs.query}...\n\n` +
                `Source: Simulated Search Results (for demonstration purposes)`;
            }
          } else if (toolName === 'file_search') {
            toolResult = `File search results for "${toolArgs.query}":\n\n` +
              `1. document1.pdf - Relevance: High\n   Context: ...information related to ${toolArgs.query}...\n\n` +
              `2. presentation.pptx - Relevance: Medium\n   Context: ...mentions ${toolArgs.query} in the context of...\n\n` +
              `3. notes.txt - Relevance: Medium\n   Context: ...discussion about ${toolArgs.query} and related topics...\n\n` +
              `Source: Simulated File Search (for demonstration purposes)`;
          } else {
            toolResult = `Tool ${toolName} was called with arguments: ${toolCall.function.arguments}`;
          }
          
          // Add tool result to new items
          newItems.push({
            type: 'tool_call_output_item',
            output: toolResult
          });
          
          // Add the tool result to the conversation
          messages.push({
            role: 'assistant',
            tool_calls: [toolCall]
          });
          
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: toolResult
          });
        }
        
        // Get a final response after tool use
        const finalResponse = await this.openai.chat.completions.create({
          model: agentData.model || 'gpt-4o',
          messages: messages,
          temperature: agentData.modelSettings?.temperature || 0.7,
        });
        
        finalOutput = finalResponse.choices[0].message.content || '';
        
        // Add the final message to new items
        newItems.push({
          type: 'message_output_item',
          raw_item: {
            content: finalOutput
          }
        });
      }
      
      // Update last used time for the agent
      agentData.last_used = new Date().toISOString();
      agentData.lastUsed = 'Just now';
      this._saveAgentToLocalStorage(agentData);
      
      // Format the response
      return {
        id: `run-${Date.now()}`,
        agent_id: agentId,
        status: 'completed',
        input: input,
        output: finalOutput,
        final_output: finalOutput,
        new_items: newItems
      };
    } catch (error) {
      console.error('Error running agent:', error);
      
      // Provide more detailed error messages
      if (error.message.includes('Network Error')) {
        throw new Error('Network error connecting to OpenAI API. Please check your internet connection and firewall settings.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Request to OpenAI API timed out. The service might be experiencing high load.');
      } else if (error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your OpenAI API key in the settings.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Your OpenAI API key has reached its request limit.');
      } else if (error.message.includes('500')) {
        throw new Error('OpenAI API server error. Please try again later.');
      } else {
        throw new Error(`Failed to run agent: ${error.message || 'Unknown error'}`);
      }
    }
  }
  
  /**
   * Validates an OpenAI API key
   * @param {string} apiKey - The API key to validate
   * @returns {Promise<boolean>} - Whether the key is valid
   */
  async validateApiKey(apiKey) {
    try {
      if (!apiKey || !apiKey.startsWith('sk-')) {
        throw new Error('Invalid API key format');
      }
      
      // Create a temporary OpenAI client to test the API key
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      
      // Make a simple API call to test the key
      await openai.models.list();
      
      // If we get here, the key is valid
      return true;
    } catch (error) {
      console.error('Error validating API key:', error);
      throw new Error('Invalid API key: ' + error.message);
    }
  }
  
  // Helper methods
  
  /**
   * Create tools from configuration
   * @private
   */
  _createToolsFromConfig(toolsConfig) {
    if (!toolsConfig || !toolsConfig.length) return [];
    
    // Convert our tool configurations to OpenAI function calling format
    return toolsConfig.map(tool => {
      if (tool.name === 'WebSearchTool') {
        // Implement web search as a function
        return {
          type: 'function',
          function: {
            name: 'web_search',
            description: 'Search the web for information',
            parameters: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The search query'
                }
              },
              required: ['query']
            }
          }
        };
      } else if (tool.name === 'FileSearchTool') {
        // Implement file search as a function
        return {
          type: 'function',
          function: {
            name: 'file_search',
            description: 'Search through vector stores of documents',
            parameters: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The search query'
                },
                max_results: {
                  type: 'number',
                  description: 'Maximum number of results to return'
                }
              },
              required: ['query']
            }
          }
        };
      } else {
        // Function tool - create a function definition
        return {
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description || '',
            parameters: this._buildJsonSchemaForTool(tool)
          }
        };
      }
    });
  }
  
  /**
   * Create handoffs from configuration
   * @private
   */
  _createHandoffsFromConfig(handoffsConfig) {
    // Simplified implementation since OpenAIAgent has a different API
    return handoffsConfig || [];
  }
  
  /**
   * Create guardrails from configuration
   * @private
   */
  _createGuardrailsFromConfig(guardrailsConfig) {
    // Simplified implementation since OpenAIAgent has a different API
    return guardrailsConfig || [];
  }
  
  /**
   * Build JSON schema for tool parameters
   * @private
   */
  _buildJsonSchemaForTool(tool) {
    if (!tool.parameters) return { type: 'object', properties: {} };
    
    const properties = {};
    const required = [];
    
    Object.entries(tool.parameters).forEach(([name, param]) => {
      if (name !== 'max_num_results' && name !== 'vector_store_ids') {
        properties[name] = {
          type: param.type || 'string',
          description: param.description || ''
        };
        
        if (param.required) {
          required.push(name);
        }
      }
    });
    
    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined
    };
  }
  
  /**
   * Convert an Agent instance to our internal format
   * @private
   */
  _convertAgentToInternalFormat(agent, agentData) {
    return {
      id: `agent-${Date.now()}`,
      name: agent.name,
      description: agentData.description || '',
      model: agentData.model || 'gpt-4o',
      instructions: agentData.instructions,
      tools: agentData.tools || [],
      handoffs: agentData.handoffs || [],
      modelSettings: agentData.modelSettings || {
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0
      },
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      lastUsed: 'Just now'
    };
  }
  
  /**
   * Create a local-only agent
   * @private
   */
  _createLocalAgent(agentData) {
    return {
      id: `agent-${Date.now()}`,
      ...agentData,
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      lastUsed: 'Just now'
    };
  }
  
  /**
   * Save an agent to local storage
   * @private
   */
  _saveAgentToLocalStorage(agent) {
    const agents = this._getAgentsFromLocalStorage();
    const existingIndex = agents.findIndex(a => a.id === agent.id);
    
    if (existingIndex >= 0) {
      agents[existingIndex] = agent;
    } else {
      agents.push(agent);
    }
    
    localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(agents));
  }
  
  /**
   * Get agents from local storage
   * @private
   */
  _getAgentsFromLocalStorage() {
    const agentsJson = localStorage.getItem(STORAGE_KEY_AGENTS);
    return agentsJson ? JSON.parse(agentsJson) : [];
  }
  
  /**
   * Get a relative time string (e.g., "2 hours ago")
   * @private
   */
  _getRelativeTimeString(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
}

// Create a named instance
const apiServiceInstance = new ApiService();

// Export the instance
export default apiServiceInstance;