@echo off
echo Testing OpenAI API connection...
echo.
echo This script will test if your OpenAI API key is working correctly.
echo.
set /p OPENAI_API_KEY=Enter your OpenAI API key (starts with sk-):
set /p AGENT_NAME=Enter a name for the test agent (optional, press Enter to use default):

if "%AGENT_NAME%"=="" (
  echo Using default agent name...
  node src/test-agent-api.js
) else (
  echo Testing with custom agent name...
  node src/test-agent-api.js
)

echo.
echo Test completed. Press any key to exit.
pause > nul