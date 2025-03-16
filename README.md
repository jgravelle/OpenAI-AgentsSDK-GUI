# OpenAI Agent Builder GUI

![OpenAI Agent Builder GUI](https://img.shields.io/badge/OpenAI-Agent%20Builder-10A37F?style=for-the-badge&logo=openai&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Material UI](https://img.shields.io/badge/Material%20UI-5.15.0-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

A professional, intuitive, and streamlined GUI application for creating, testing, and managing OpenAI agents using the OpenAI Agents SDK. Build powerful AI agents with custom tools, handoffs, and guardrails without writing code.

> **IMPORTANT**: This project is created by J. Gravelle (https://j.gravelle.us | j@gravelle.us) and is **not affiliated with, endorsed by, or sponsored by OpenAI**. It is an independent tool designed to work with the OpenAI Agents SDK.

## 🌟 Features

### Agent Creation & Management
- **Intuitive Agent Builder**: Step-by-step wizard interface for creating agents
- **Visual Tool Configuration**: Add and configure tools with a user-friendly interface
- **Agent Dashboard**: Manage all your agents in one place
- **Clone & Edit**: Easily duplicate and modify existing agents

### Advanced Capabilities
- **Custom Instructions**: Create detailed system prompts for your agents
- **Model Selection**: Choose from OpenAI's latest models including GPT-4o
- **Tool Integration**: Add web search, file search, and custom function tools
- **Agent Handoffs**: Configure specialist agents for delegation
- **Guardrails**: Set up input and output validation mechanisms

### Testing & Deployment
- **Built-in Test Environment**: Test your agents directly in the application
- **Real-time Chat Interface**: Interact with your agents and see tool usage
- **Code Generation**: Automatically generate Python code for the OpenAI Agents SDK
- **Export Options**: Download or copy code for use in your applications

### User Experience
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works on desktop and tablet devices
- **Local Storage**: Agents are saved locally for privacy and convenience
- **API Key Management**: Securely store and validate your OpenAI API key

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/openai-agent-builder.git
cd openai-agent-builder
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `build/` directory and can be served using any static file server.

## 📖 Usage Guide

### Setting Up Your API Key

1. When you first launch the application, you'll be prompted to enter your OpenAI API key
2. Your API key is stored locally in your browser and is never sent to our servers
3. You can test your API key with the included test script:
   ```bash
   ./test-agent.bat
   ```

### Creating Your First Agent

1. Click the "Create Agent" button on the dashboard
2. Follow the step-by-step wizard:
   - **Basic Details**: Set name, description, and model
   - **Instructions**: Define your agent's system prompt
   - **Tools**: Add capabilities like web search or custom functions
   - **Handoffs**: Configure specialist agents for delegation
   - **Guardrails**: Set up input and output validation
   - **Code Preview**: View and export the generated code
   - **Test Agent**: Try out your agent in a chat interface

### Testing Your Agent

1. Use the built-in test environment to interact with your agent
2. See how your agent responds to different inputs
3. Observe tool usage and handoffs in real-time
4. Refine your agent based on test results

### Deploying Your Agent

1. Generate Python code for your agent using the Code Preview tab
2. Copy or download the code
3. Use the code in your own applications with the OpenAI Agents SDK
4. Follow the OpenAI Agents SDK documentation for advanced usage

## 🏗️ Architecture

This application follows the OpenAI Agents SDK architecture as outlined in the OpenAI Agents SDK Reference Guide. The key components include:

### Core Components

- **Agent**: Core component for defining agents with instructions, tools, and other capabilities
- **Runner**: Used for executing agents with user inputs
- **Tools**: Function tools, web search, file search, and other capabilities
- **Handoffs**: Delegation to specialist agents for specific tasks
- **Guardrails**: Input and output validation mechanisms
- **Tracing**: Monitoring and debugging agent execution

### Application Structure

- **React Frontend**: Built with React and Material UI for a responsive user interface
- **Local Storage**: Agents and settings are stored in browser local storage
- **OpenAI API Integration**: Direct integration with OpenAI's API for agent execution
- **Code Generation**: Templates for generating Python code for the OpenAI Agents SDK

## 🔧 Implementation Details

The application uses the following key components:

- **apiService.js**: Core service that interfaces with the OpenAI Agents SDK
- **AgentBuilder.js**: Multi-step form for creating and configuring agents
- **TestAgent.js**: Testing environment that uses the SDK to run agents
- **CodePreview.js**: Generates Python code for using the agents in your own applications
- **Dashboard.js**: Manages the list of agents and provides CRUD operations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and Material UI
- Powered by the OpenAI Agents SDK
- Inspired by the growing need for accessible AI agent creation tools

## 🔗 Links

- [OpenAI Agents SDK Documentation](https://platform.openai.com/docs/agents)
- [React Documentation](https://reactjs.org/)
- [Material UI Documentation](https://mui.com/)

---

<p align="center">
  <i>Build powerful AI agents without writing code</i><br>
  <a href="https://github.com/yourusername/openai-agent-builder/issues">Report Bug</a> ·
  <a href="https://github.com/yourusername/openai-agent-builder/issues">Request Feature</a>
</p>