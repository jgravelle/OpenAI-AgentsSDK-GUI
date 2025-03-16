export const builtInTools = [
  {
    id: 'websearch',
    name: 'WebSearchTool',
    description: 'Search the web for information',
    category: 'Built-in',
    parameters: {}
  },
  {
    id: 'filesearch',
    name: 'FileSearchTool',
    description: 'Search through vector stores of documents',
    category: 'Built-in',
    parameters: {
      max_num_results: 3,
      vector_store_ids: []
    }
  }
];

export const exampleFunctionTools = [
  {
    id: 'weather',
    name: 'get_weather',
    description: 'Get weather information for a city',
    category: 'Function',
    parameters: {
      city: {
        type: 'string',
        description: 'The city to get weather for'
      }
    },
    code: `@function_tool
def get_weather(city: str) -> str:
    """Fetch weather for a city.
    
    Args:
        city: The city to get weather for.
    """
    # Implementation
    return f"The weather in {city} is sunny"`
  },
  {
    id: 'calculator',
    name: 'calculate',
    description: 'Perform a calculation',
    category: 'Function',
    parameters: {
      expression: {
        type: 'string',
        description: 'The mathematical expression to evaluate'
      }
    },
    code: `@function_tool
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression.
    
    Args:
        expression: The expression to evaluate.
    """
    # Implementation with proper sanitization
    try:
        result = eval(expression, {"__builtins__": {}}, {"sin": math.sin, "cos": math.cos})
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {str(e)}"`
  }
];