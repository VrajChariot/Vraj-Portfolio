// Skills grouped by the layer of the stack they live in, top (model) to bottom (hardware).
// `match` holds case-insensitive patterns used to find evidence in projects and experience.
export const skillGroups = [
  {
    id: 'models',
    label: 'Models and agents',
    summary: 'Getting LLMs to do dependable work.',
    skills: [
      { name: 'LLM APIs', match: ['llm'] },
      { name: 'Azure AI Foundry', match: ['azure ai foundry'] },
      { name: 'Tool and function calling', match: ['function calling', 'function-calling', 'tool/function'] },
      { name: 'Structured output', match: ['structured output'] },
      { name: 'Retrieval', match: ['retrieval'] },
      { name: 'LLM evaluation', match: ['evaluation'] },
      { name: 'Prompt-injection guardrails', match: ['prompt-injection', 'guardrail'] },
      { name: 'Model Context Protocol', match: ['model context protocol', '\\bmcp\\b'] },
      { name: 'Speech-to-speech', match: ['speech-to-speech'] },
    ],
  },
  {
    id: 'services',
    label: 'Services and data',
    summary: 'The backends that agents call and products run on.',
    skills: [
      { name: 'Python', match: ['python', 'fastapi'] },
      { name: 'FastAPI', match: ['fastapi'] },
      { name: 'Node.js', match: ['node\\.js', '\\bnode\\b'] },
      { name: 'Express', match: ['express'] },
      { name: 'PostgreSQL', match: ['postgres'] },
      { name: 'MongoDB', match: ['mongo'] },
      { name: 'WebSockets', match: ['websocket', 'socket-based'] },
      { name: 'TCP sockets', match: ['tcp'] },
    ],
  },
  {
    id: 'interfaces',
    label: 'Interfaces',
    summary: 'Where people meet the system.',
    skills: [
      { name: 'TypeScript', match: ['typescript'] },
      { name: 'React', match: ['react'] },
      { name: 'JavaScript', match: ['javascript'] },
      { name: 'Tailwind CSS', match: ['tailwind'] },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery and hardware',
    summary: 'Shipping it and keeping it running.',
    skills: [
      { name: 'CI pipelines', match: ['\\bci\\b'] },
      { name: 'uv packaging', match: ['\\buv\\b'] },
      { name: 'Git and GitHub', match: ['github'] },
      { name: 'IoT devices', match: ['iot', 'microcontroller', 'sensor'] },
      { name: 'C++', match: ['c\\+\\+'] },
    ],
  },
];
