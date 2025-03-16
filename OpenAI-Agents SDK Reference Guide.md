# OpenAI Agents SDK Reference Guide

## Installation & Setup
```python
pip install openai-agents
export OPENAI_API_KEY=sk-...  # or set via code
```

```python
from agents import set_default_openai_key, set_default_openai_client
set_default_openai_key("your-key", use_for_tracing=True)  # If not using env var
```

## Core Components

### Agent
```python
from agents import Agent, ModelSettings

agent = Agent(
    name="MyAgent",                   # Required: Agent's name
    instructions="Your prompt here",  # Required: System prompt/instructions
    model="o3-mini",                  # Optional: Default is "gpt-4o"
    tools=[],                         # Optional: Tools the agent can use
    handoffs=[],                      # Optional: Sub-agents to delegate to
    output_type=None,                 # Optional: Structured output type
    input_guardrails=[],              # Optional: Input validation
    output_guardrails=[],             # Optional: Output validation
    hooks=None,                       # Optional: Lifecycle hooks
)
```

### Context (Generic Type Parameter)
```python
from dataclasses import dataclass

@dataclass
class UserContext:
    uid: str
    is_pro_user: bool

agent = Agent[UserContext](
    name="Contextual Agent",
    instructions="Help user based on their context",
)
```

### Structured Output
```python
from pydantic import BaseModel

class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]

agent = Agent(
    name="Calendar extractor",
    instructions="Extract calendar events from text",
    output_type=CalendarEvent,  # Will use structured outputs
)
```

### Dynamic Instructions
```python
def dynamic_instructions(context, agent):
    return f"The user's name is {context.context.name}. Help them with their questions."

agent = Agent[UserContext](
    name="Dynamic Agent",
    instructions=dynamic_instructions,  # Function that returns instructions
)
```

### Cloning Agents
```python
new_agent = existing_agent.clone(
    name="New Name",
    instructions="New instructions",
)
```

## Running Agents

### Basic Runner
```python
from agents import Agent, Runner

# Async version
result = await Runner.run(agent, "Your prompt here")

# Sync version
result = Runner.run_sync(agent, "Your prompt here")

# Streaming version
stream_result = Runner.run_streamed(agent, "Your prompt here")
async for event in stream_result.stream_events():
    # Process streaming events
    pass
```

### Runner Configuration
```python
from agents import RunConfig

result = await Runner.run(
    agent, 
    "Your prompt", 
    context=your_context_object,  # Optional: Context object
    run_config=RunConfig(
        model="custom-model-override",
        model_settings=ModelSettings(temperature=0.5),
        workflow_name="My Workflow",
        trace_id="custom-trace-id",
        group_id="conversation-id",
        max_turns=10,
        tracing_disabled=False,
    )
)
```

### Conversation Management
```python
# First turn
result = await Runner.run(agent, "What's the weather?")

# Subsequent turns (preserving conversation history)
new_input = result.to_input_list() + [{"role": "user", "content": "What about tomorrow?"}]
result = await Runner.run(agent, new_input)
```

## Tools

### Function Tools
```python
from agents import function_tool

@function_tool
def get_weather(city: str) -> str:
    """Fetch weather for a city.
    
    Args:
        city: The city to get weather for.
    """
    # Implementation
    return f"The weather in {city} is sunny"

agent = Agent(
    name="Weather Bot",
    tools=[get_weather],  # Pass the decorated function
)
```

### Custom Function Tools
```python
from agents import FunctionTool
from pydantic import BaseModel

class FunctionArgs(BaseModel):
    query: str

async def search_function(ctx, args_json: str) -> str:
    args = FunctionArgs.model_validate_json(args_json)
    # Implementation
    return f"Results for {args.query}"

tool = FunctionTool(
    name="search",
    description="Search for information",
    params_json_schema=FunctionArgs.model_json_schema(),
    on_invoke_tool=search_function,
)
```

### Hosted Tools
```python
from agents import WebSearchTool, FileSearchTool

agent = Agent(
    name="Research Assistant",
    tools=[
        WebSearchTool(),
        FileSearchTool(max_num_results=3, vector_store_ids=["VECTOR_STORE_ID"]),
    ],
)
```

### Agent as Tool
```python
spanish_agent = Agent(name="Spanish Translator", instructions="Translate to Spanish")

main_agent = Agent(
    name="Translation Orchestrator",
    tools=[
        spanish_agent.as_tool(
            tool_name="translate_to_spanish",
            tool_description="Translate text to Spanish"
        ),
    ]
)
```

## Handoffs

### Basic Handoffs
```python
billing_agent = Agent(name="Billing Agent", instructions="Handle billing inquiries")
refund_agent = Agent(name="Refund Agent", instructions="Process refund requests")

triage_agent = Agent(
    name="Customer Support",
    instructions="Direct users to appropriate specialists",
    handoffs=[billing_agent, refund_agent],
)
```

### Custom Handoffs
```python
from agents import handoff, RunContextWrapper
from pydantic import BaseModel

class EscalationData(BaseModel):
    reason: str

async def on_handoff(ctx: RunContextWrapper, input_data: EscalationData):
    print(f"Escalation reason: {input_data.reason}")

handoff_obj = handoff(
    agent=specialist_agent,
    on_handoff=on_handoff,
    input_type=EscalationData,
    tool_name_override="escalate_to_specialist",
)

agent = Agent(
    name="Support Agent",
    handoffs=[handoff_obj],
)
```

### Input Filters
```python
from agents import handoff
from agents.extensions import handoff_filters

filtered_handoff = handoff(
    agent=specialist_agent,
    input_filter=handoff_filters.remove_all_tools,  # Predefined filter
)
```

## Guardrails

### Input Guardrails
```python
from agents import Agent, GuardrailFunctionOutput, InputGuardrailTripwireTriggered, input_guardrail

@input_guardrail
async def content_filter(ctx, agent, input):
    # Check input
    is_inappropriate = check_inappropriate(input)
    
    return GuardrailFunctionOutput(
        output_info={"reason": "Contains inappropriate content"},
        tripwire_triggered=is_inappropriate,
    )

agent = Agent(
    name="Protected Agent",
    instructions="Help with questions",
    input_guardrails=[content_filter],
)

# Usage with exception handling
try:
    result = await Runner.run(agent, user_input)
except InputGuardrailTripwireTriggered as e:
    print("Input guardrail was triggered:", e.guardrail_result.output_info)
```

### Output Guardrails
```python
from pydantic import BaseModel
from agents import Agent, GuardrailFunctionOutput, OutputGuardrailTripwireTriggered, output_guardrail

class MessageOutput(BaseModel):
    response: str

@output_guardrail
async def output_filter(ctx, agent, output: MessageOutput):
    # Check output
    contains_pii = check_for_pii(output.response)
    
    return GuardrailFunctionOutput(
        output_info={"reason": "Contains PII"},
        tripwire_triggered=contains_pii,
    )

agent = Agent(
    name="Secure Agent",
    instructions="Help with questions",
    output_guardrails=[output_filter],
    output_type=MessageOutput,
)
```

## Orchestration Patterns

### LLM-Driven Orchestration
```python
# Single agent with tools and handoffs
orchestrator = Agent(
    name="Orchestrator",
    instructions="Plan and execute complex tasks using available tools",
    tools=[search_tool, calculator_tool, fetch_data_tool],
    handoffs=[specialist_agent1, specialist_agent2],
)
```

### Code-Driven Orchestration
```python
# Sequential agent chain
outline_result = await Runner.run(outline_agent, "Write a blog post about climate change")
full_draft = await Runner.run(writer_agent, f"Expand this outline: {outline_result.final_output}")
final_post = await Runner.run(editor_agent, f"Edit this draft: {full_draft.final_output}")

# Parallel agents
import asyncio
results = await asyncio.gather(
    Runner.run(research_agent1, "Research topic A"),
    Runner.run(research_agent2, "Research topic B")
)

# Evaluation loop
max_attempts = 3
for i in range(max_attempts):
    result = await Runner.run(writer_agent, "Generate content")
    eval_result = await Runner.run(evaluator_agent, result.final_output)
    if eval_result.final_output.score > 0.8:
        break
```

## Tracing

### Basic Tracing
```python
from agents import trace

# Wrap multiple operations in a single trace
with trace("Workflow Name", group_id="conversation-123"):
    result1 = await Runner.run(agent1, "First query")
    result2 = await Runner.run(agent2, "Second query")
```

### Tracing Configuration
```python
from agents import set_tracing_disabled, add_trace_processor

# Disable tracing globally
set_tracing_disabled(True)

# Custom trace processor
class MyTraceProcessor(TracingProcessor):
    # Implementation

add_trace_processor(MyTraceProcessor())
```

## Result Handling

```python
result = await Runner.run(agent, "Your prompt")

# Access final output (string or structured output)
print(result.final_output)

# Access the last agent that ran
last_agent = result.last_agent

# Get input for next conversation turn
next_input = result.to_input_list() + [{"role": "user", "content": "Follow-up question"}]

# Examine generated items
for item in result.new_items:
    if item.type == "message_output_item":
        print("Agent said:", item.raw_item.content)
    elif item.type == "tool_call_item":
        print("Called tool:", item.raw_item.name)
    elif item.type == "tool_call_output_item":
        print("Tool result:", item.output)
```

## Streaming Events

```python
stream_result = Runner.run_streamed(agent, "Your prompt")

async for event in stream_result.stream_events():
    if event.type == "raw_response_event":
        # Process token-by-token (most granular)
        if hasattr(event.data, "delta"):
            print(event.data.delta, end="", flush=True)
    
    elif event.type == "run_item_stream_event":
        # Process complete items
        if event.item.type == "message_output_item":
            print("Message complete:", event.item.raw_item.content)
        elif event.item.type == "tool_call_item":
            print("Tool call:", event.item.raw_item.name)
    
    elif event.type == "agent_updated_stream_event":
        print("Agent changed to:", event.new_agent.name)
```