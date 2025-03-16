# Getting Started with OpenAI Agent Builder GUI

This guide will help you set up and start using the OpenAI Agent Builder GUI to create, test, and deploy AI agents.

**IMPORTANT**: This project is created by J. Gravelle (https://j.gravelle.us | j@gravelle.us) and is **not affiliated with, endorsed by, or sponsored by OpenAI**. It is an independent tool designed to work with the OpenAI Agents SDK.

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- An OpenAI API key with access to the latest models

## Installation

### Option 1: Clone from GitHub

1. Clone the repository:
```bash
git clone https://github.com/yourusername/openai-agent-builder.git
cd openai-agent-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Option 2: Use the Hosted Version

Visit [https://openai-agent-builder.example.com](https://openai-agent-builder.example.com) to use the hosted version without installation.

## Setting Up Your API Key

1. When you first launch the application, you'll be prompted to enter your OpenAI API key
2. Enter your API key (starts with `sk-`)
3. The key will be validated and stored locally in your browser
4. You can update or change your API key later in the settings

## Creating Your First Agent

### Step 1: Basic Details

1. From the dashboard, click "Create Agent"
2. Enter a name and description for your agent
3. Select a model (GPT-4o recommended for best performance)
4. Click "Next"

### Step 2: Instructions

1. Enter detailed instructions for your agent
2. These instructions act as the system prompt that guides your agent's behavior
3. Be specific about the agent's role, tone, and limitations
4. Click "Next"

### Step 3: Tools

1. Select tools your agent can use:
   - Web Search: Allow your agent to search the web for information
   - File Search: Enable searching through documents
   - Custom Functions: Define custom tools with parameters
2. Configure each tool's parameters
3. Click "Next"

### Step 4: Handoffs

1. Configure specialist agents that your main agent can delegate to
2. Define when and how handoffs should occur
3. Click "Next"

### Step 5: Guardrails

1. Set up input guardrails to validate user inputs
2. Configure output guardrails to ensure appropriate responses
3. Click "Next"

### Step 6: Code Preview

1. Review the generated Python code for your agent
2. Copy or download the code for use in your applications
3. Click "Next"

### Step 7: Test Agent

1. Test your agent with different inputs
2. Observe how it uses tools and responds to queries
3. Save your agent when satisfied

## Next Steps

- Explore the [OpenAI Agents SDK Documentation](https://platform.openai.com/docs/agents) for advanced usage
- Check out our [example agents](./example-agents.md) for inspiration
- Learn about [deployment options](./deployment.md) for production use

## Troubleshooting

If you encounter issues:

1. Ensure your API key is valid and has sufficient quota
2. Check that you're using a supported browser (Chrome, Firefox, Safari, Edge)
3. Clear your browser cache if you experience UI issues
4. See our [FAQ](./faq.md) for common questions and answers

## Getting Help

- Open an issue on GitHub for bugs or feature requests
- Join our community forum for discussions and support
- Check the [documentation](./index.md) for detailed guides