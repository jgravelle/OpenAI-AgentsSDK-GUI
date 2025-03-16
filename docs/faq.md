# Frequently Asked Questions (FAQ)

## General Questions

### What is the OpenAI Agent Builder GUI?
The OpenAI Agent Builder GUI is a visual interface for creating, testing, and managing AI agents using the OpenAI Agents SDK. It allows you to build powerful AI agents without writing code.

### Is this an official OpenAI tool?
No, this is a third-party tool built on top of the OpenAI Agents SDK. It is not officially affiliated with, endorsed by, or sponsored by OpenAI. This project is created and maintained by J. Gravelle (https://j.gravelle.us | j@gravelle.us) as an independent tool designed to work with the OpenAI Agents SDK.

### Is the OpenAI Agent Builder GUI free to use?
The OpenAI Agent Builder GUI itself is open-source and free to use. However, you will need an OpenAI API key to use the agents, which is a paid service from OpenAI.

## API Keys and Pricing

### Where do I get an OpenAI API key?
You can get an OpenAI API key by signing up at [https://platform.openai.com/signup](https://platform.openai.com/signup) and creating an API key in your account dashboard.

### How much does it cost to use the agents?
The cost depends on the OpenAI models you use and the number of tokens processed. You can find the current pricing on the [OpenAI pricing page](https://openai.com/pricing).

### Is my API key secure?
Yes, your API key is stored locally in your browser's localStorage and is never sent to our servers. It is only used to make direct API calls to OpenAI.

### Can I use this without an API key?
No, an OpenAI API key is required to create and test agents. The application cannot function without a valid API key.

## Features and Functionality

### What models can I use with the Agent Builder?
You can use any of the models supported by the OpenAI Agents SDK, including GPT-4o, GPT-4, and GPT-3.5 Turbo.

### What tools can I add to my agents?
You can add various tools including:
- Web Search Tool for searching the internet
- File Search Tool for searching through documents
- Custom Function Tools that you define
- And more as the OpenAI Agents SDK evolves

### Can I export my agents?
Yes, you can export your agents as Python code that uses the OpenAI Agents SDK. This code can be integrated into your own applications.

### Can I import agents from elsewhere?
Currently, the application does not support importing agents from external sources. This feature may be added in future updates.

## Technical Questions

### What technologies does the OpenAI Agent Builder GUI use?
The application is built with:
- React for the frontend
- Material UI for the component library
- Monaco Editor for code editing
- OpenAI Agents SDK for agent functionality

### Does the application work offline?
The interface itself can work offline, but creating and testing agents requires an internet connection to communicate with the OpenAI API.

### Where is my data stored?
All your agent configurations are stored locally in your browser's localStorage. Nothing is sent to external servers except the API calls to OpenAI.

### Can I self-host the OpenAI Agent Builder GUI?
Yes, you can clone the repository and run it locally or deploy it to your own server. See the [deployment guide](./deployment.md) for more information.

## Troubleshooting

### I'm getting an "Invalid API key" error
Make sure your API key is correct and has not expired. You can verify your API key in the OpenAI dashboard.

### My agent isn't working as expected
Check the following:
1. Ensure your instructions are clear and specific
2. Verify that the tools you've added are properly configured
3. Test with different inputs to understand the agent's behavior
4. Check the OpenAI status page for any service disruptions

### The application is slow or unresponsive
This could be due to:
1. Slow internet connection
2. High load on the OpenAI API
3. Browser performance issues (try clearing cache or using a different browser)

### I'm hitting rate limits with the OpenAI API
OpenAI imposes rate limits on API calls. If you're hitting these limits:
1. Implement caching for common queries
2. Add delays between requests
3. Consider upgrading your OpenAI plan for higher rate limits

## Contributing and Support

### How can I contribute to the project?
You can contribute by:
1. Submitting bug reports or feature requests on GitHub
2. Contributing code via pull requests
3. Improving documentation
4. Sharing the project with others

See the [CONTRIBUTING.md](../CONTRIBUTING.md) file for more details.

### Where can I get help if I have questions?
You can:
1. Check this FAQ and the documentation
2. Open an issue on GitHub for bugs or feature requests
3. Join our community forum for discussions
4. Reach out via email for direct support

### Are there any tutorials or examples?
Yes, check out the [example agents](./example-agents.md) documentation for inspiration and guidance on creating different types of agents.

### How do I report a security vulnerability?
Please refer to our [SECURITY.md](../SECURITY.md) file for information on reporting security vulnerabilities.