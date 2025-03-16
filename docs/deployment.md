# Deployment Guide

This guide provides instructions for deploying the OpenAI Agent Builder GUI and the agents you create with it in various environments.

**IMPORTANT**: This project is created by J. Gravelle (https://j.gravelle.us | j@gravelle.us) and is **not affiliated with, endorsed by, or sponsored by OpenAI**. It is an independent tool designed to work with the OpenAI Agents SDK.

## Deploying the OpenAI Agent Builder GUI

### Option 1: Static Site Hosting

The OpenAI Agent Builder GUI is a React application that can be built into static files and hosted on any static site hosting service.

1. Build the application:
```bash
npm run build
```

2. The build files will be created in the `build/` directory.

3. Deploy these files to your preferred static hosting service:
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Firebase Hosting
   - Azure Static Web Apps

### Option 2: Docker Deployment

1. Build a Docker image using the provided Dockerfile:
```bash
docker build -t openai-agent-builder .
```

2. Run the container:
```bash
docker run -p 3000:80 openai-agent-builder
```

3. Access the application at `http://localhost:3000`

### Option 3: Self-Hosted Server

1. Build the application:
```bash
npm run build
```

2. Serve the build directory using a web server like Nginx or Apache.

Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Deploying Agents Created with the Builder

### Option 1: Python Script

The simplest way to deploy an agent is to use the generated Python code:

1. Export the code from the Code Preview tab
2. Create a new Python file with the exported code
3. Install the OpenAI Agents SDK:
```bash
pip install openai-agents
```
4. Set your OpenAI API key:
```python
import os
os.environ["OPENAI_API_KEY"] = "your-api-key"
```
5. Run the script:
```bash
python your_agent_script.py
```

### Option 2: Web API

You can create a simple web API to expose your agent:

1. Create a Flask application:
```python
from flask import Flask, request, jsonify
from your_agent_module import agent, Runner

app = Flask(__name__)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')
    
    # Run the agent
    result = Runner.run_sync(agent, user_input)
    
    return jsonify({
        'response': result.final_output
    })

if __name__ == '__main__':
    app.run(debug=True)
```

2. Deploy the Flask application to a server or serverless platform.

### Option 3: Integration with Existing Applications

To integrate an agent into an existing application:

1. Install the OpenAI Agents SDK in your application
2. Copy the agent definition code from the Code Preview tab
3. Use the agent in your application code:

```python
# Import the agent definition
from your_agent_module import agent

# Use the agent in your application
def process_user_input(user_input):
    result = Runner.run_sync(agent, user_input)
    return result.final_output
```

## Production Considerations

### API Key Management

Never hardcode your OpenAI API key in your application code. Instead:

1. Use environment variables
2. Use a secrets management service
3. Implement proper key rotation and monitoring

### Rate Limiting and Quotas

Be aware of OpenAI's rate limits and quotas:

1. Implement retry logic with exponential backoff
2. Monitor API usage to avoid unexpected costs
3. Set up alerts for approaching quota limits

### Error Handling

Implement robust error handling:

1. Handle API errors gracefully
2. Provide fallback responses when the API is unavailable
3. Log errors for debugging and monitoring

### Monitoring and Logging

Set up monitoring and logging:

1. Log agent inputs and outputs for debugging
2. Monitor performance metrics
3. Set up alerts for critical errors

### Security Considerations

1. Validate and sanitize user inputs
2. Implement authentication and authorization
3. Use HTTPS for all API communications
4. Regularly update dependencies

## Scaling Considerations

For high-traffic applications:

1. Implement caching for common queries
2. Use a load balancer for distributing traffic
3. Consider serverless architectures for automatic scaling
4. Optimize prompt design to reduce token usage

## Cost Optimization

To optimize costs:

1. Use the most appropriate model for your use case
2. Implement caching for repeated queries
3. Optimize prompts to reduce token usage
4. Monitor and analyze API usage regularly