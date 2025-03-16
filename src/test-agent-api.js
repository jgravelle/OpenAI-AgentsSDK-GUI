// Simple test script to verify that the OpenAI API is working properly
const { OpenAI } = require('openai-agents');

// Configuration
const API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-here';
const AGENT_NAME = process.env.AGENT_NAME || 'Test Agent';

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API...');
    
    // Create OpenAI client
    console.log('Setting up OpenAI client...');
    const openai = new OpenAI({
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true
    });
    
    // Step 1: List models to verify API key
    console.log('Listing models...');
    const models = await openai.models.list();
    console.log(`Successfully listed ${models.data.length} models`);
    
    // Step 2: Create a chat completion
    console.log('Creating chat completion...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use a cheaper model for testing
      messages: [
        { role: "system", content: `You are ${AGENT_NAME}. Answer questions concisely and accurately.` },
        { role: "user", content: "Hello, can you help me with something?" }
      ]
    });
    
    // Step 3: Display the result
    console.log('\nAgent response:');
    console.log(completion.choices[0].message.content);
    
    console.log('\nTest completed successfully!');
    return true;
  } catch (error) {
    console.error('Error testing OpenAI API:', error);
    return false;
  }
}

// Run the test
testOpenAI().then(success => {
  if (success) {
    console.log('API test passed! Your OpenAI API key is working correctly.');
  } else {
    console.log('API test failed. Please check your API key and ensure the OpenAI API is accessible.');
  }
});