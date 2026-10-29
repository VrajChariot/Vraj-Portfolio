// The path one request takes through each project, keyed by project view id.
export const projectFlows = {
  'work-ableton-copilot': [
    { label: 'MCP client', detail: 'Claude Desktop, Cursor or VS Code' },
    { label: 'MCP server', detail: '25 tools, Python, installed with uv' },
    { label: 'TCP socket', detail: 'Tool calls as JSON messages' },
    { label: 'Remote Script', detail: "Runs inside Live's embedded Python" },
    { label: 'Ableton Live', detail: 'Session, clips, devices, arrangement' },
  ],
  'work-skillbridge-ai': [
    { label: 'Resume and job description', detail: 'Uploaded by the candidate' },
    { label: 'Prompt pipeline', detail: 'ATS scoring and keyword analysis' },
    { label: 'Structured output', detail: 'Schema-shaped scores and findings' },
    { label: 'Assessment report', detail: 'Recommendations for the candidate' },
  ],
  'work-builda': [
    { label: 'Voice', detail: 'Speech in over WebSockets' },
    { label: 'Speech-to-speech LLM', detail: 'Streamed audio responses' },
    { label: 'Function calls', detail: 'Web search and app edits' },
    { label: 'Web app', detail: 'Generated and changed by conversation' },
  ],
};
