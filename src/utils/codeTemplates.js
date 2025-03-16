export const agentTemplate = `from agents import Agent, ModelSettings

agent = Agent(
    name="{{name}}",
    instructions="{{instructions}}",
    model="{{model}}",
    tools=[{{tools}}],
    handoffs=[{{handoffs}}],
)
`;

export const functionToolTemplate = `from agents import function_tool

@function_tool
def {{name}}({{parameters}}) -> str:
    """{{description}}
    
    Args:
        {{args_docs}}
    """
    # Implementation
    {{implementation}}
`;

export const structuredOutputTemplate = `from pydantic import BaseModel

class {{className}}(BaseModel):
    {{fields}}

agent = Agent(
    name="{{name}}",
    instructions="{{instructions}}",
    output_type={{className}},
)
`;

export const guardrailTemplate = `from agents import Agent, GuardrailFunctionOutput, input_guardrail

@input_guardrail
async def content_filter(ctx, agent, input):
    # Check input
    is_inappropriate = False  # Replace with actual check
    
    return GuardrailFunctionOutput(
        output_info={"reason": "Contains inappropriate content"},
        tripwire_triggered=is_inappropriate,
    )

agent = Agent(
    name="{{name}}",
    instructions="{{instructions}}",
    input_guardrails=[content_filter],
)
`;

export const runnerTemplate = `from agents import Runner

# Async version
result = await Runner.run(agent, "{{prompt}}")

# Access results
print(result.final_output)
`;

export const streamingTemplate = `from agents import Runner

stream_result = Runner.run_streamed(agent, "{{prompt}}")

async for event in stream_result.stream_events():
    if event.type == "run_item_stream_event":
        if event.item.type == "message_output_item":
            print("Message:", event.item.raw_item.content)
        elif event.item.type == "tool_call_item":
            print("Tool call:", event.item.raw_item.name)
`;

export const fullToolExampleTemplate = `from agents import function_tool
from typing import Dict, Any, List

@function_tool
def get_weather(city: str, days: int = 1) -> Dict[str, Any]:
    """Get weather forecast for a city.
    
    Args:
        city: The city to get weather for.
        days: Number of days to forecast (default: 1).
    
    Returns:
        Dict containing weather data.
    """
    # This would normally call a weather API
    # Sample implementation:
    return {
        "city": city,
        "forecast": [
            {"day": 1, "condition": "Sunny", "temperature": 28},
            {"day": 2, "condition": "Partly Cloudy", "temperature": 25},
            {"day": 3, "condition": "Rainy", "temperature": 20}
        ][:days]
    }
`;