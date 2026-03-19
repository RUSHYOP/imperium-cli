---
name: ai-agent-integrator
description: >
  Build and integrate custom AI agents into websites and applications. Use this skill
  whenever someone wants to add an AI agent to their app, embed a chatbot that can also
  modify code or files on the backend, create a task-specific AI assistant within a product,
  build an agent with constrained outputs, set up dual-channel AI (text responses in chat +
  code changes on the server), integrate OpenAI/Anthropic/other LLM APIs into a web app,
  or design an agent system where the AI gives text answers to users but applies code
  modifications server-side. Also trigger when someone asks about agent configuration,
  system prompts for embedded agents, tool-calling architectures, streaming chat UIs,
  function calling with backend execution, or building AI copilot features into their product.
  This skill covers the full stack: frontend chat interface, backend agent orchestration,
  provider integration, agent customization, and the critical separation between what the
  user sees (text) and what the system does (code modifications).
---

# AI Agent Integrator

You build custom AI agents that live inside websites and applications. These aren't generic chatbots — they're purpose-built agents that do specific tasks and produce specific outputs, integrated directly into a product's architecture.

The core architectural principle: **text goes to the chat, code goes to the backend**. The user sees conversational responses in a chat interface. Behind the scenes, the agent can read, modify, and create code or data on the server. These are two separate output channels routed through one agent.

## Before You Start

Every integration is different, so gather context before writing any code:

1. **Read the project** — Check the existing tech stack, framework, folder structure, and any existing API routes. Don't assume.
2. **Identify the agent's job** — What specific tasks should this agent do? "Help users" is too vague. "Generate SQL queries from natural language and execute them against the reporting database" is specific enough to build.
3. **Map the output channels** — What goes to the chat UI (text, markdown, status updates)? What happens on the backend (file edits, database writes, API calls, code generation)?
4. **Check for existing patterns** — Does the project already have WebSocket connections, API middleware, auth patterns? Build on what's there rather than introducing competing patterns.
5. **Ask about constraints** — Rate limits, cost budgets, which files the agent can touch, what operations need human approval before executing.

If any of these are unclear, ask the user. A well-scoped agent is dramatically more useful than a vaguely-defined one.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (Chat UI)                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Chat Input    │───▶│ Message List  │◀──│ Stream Reader │  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘  │
│         │                                        │          │
│         ▼                                        │          │
│    POST /api/agent/chat ────────────────── SSE stream back  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Agent Orchestration)                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Agent Router  │───▶│ LLM Provider │───▶│ Tool Executor │  │
│  │ (config +     │    │ (OpenAI /    │    │ (code mods,   │  │
│  │  auth + rate  │    │  Anthropic / │    │  file ops,    │  │
│  │  limiting)    │    │  local)      │    │  DB queries)  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         ▼                    ▼                    ▼          │
│    System Prompt      Response Stream      Side Effects     │
│    (task scope)       (text → chat)        (code → backend) │
└─────────────────────────────────────────────────────────────┘
```

**The flow:**
1. User sends a message from the chat UI
2. Backend receives it, loads the agent's configuration (system prompt, allowed tools, constraints)
3. Backend calls the LLM provider with the message + conversation history + tool definitions
4. LLM responds with either text (streamed back to chat) or tool calls (executed on the backend)
5. Tool results feed back into the LLM for the next response
6. Final text response streams to the frontend chat

Text is the user's interface. Code execution is the system's interface. The user never sees raw code output unless the agent is specifically designed to show it (like a coding assistant).

## Choosing Your Approach

The right architecture depends on what the agent needs to do:

- **Simple Q&A agent** (no code modifications) → Single API endpoint, stream LLM responses directly to chat. No tool-calling needed. Straightforward.
- **Agent with read-only tools** (searches files, queries databases, but doesn't modify anything) → Add tool definitions to the LLM call. Execute tools on the backend, feed results back to the LLM, stream the final answer. Low risk.
- **Agent with write tools** (modifies code, writes files, runs commands) → Same as above but with an approval layer. Dangerous operations should require user confirmation before execution. This is where the architecture matters most.
- **Multi-agent system** (several specialized agents coordinated by an orchestrator) → Router agent decides which specialist handles the request. Each specialist has its own system prompt and tool set. More complex, only use when a single agent can't cover the scope.

Start with the simplest approach that works. You can always add tool-calling later — ripping out an over-engineered agent system is painful.

## Agent Configuration

Every agent needs a configuration that defines its identity, capabilities, and constraints. This lives on the backend — never expose agent configuration to the frontend.

```typescript
interface AgentConfig {
  // Identity
  id: string;
  name: string;
  description: string;

  // LLM settings
  provider: 'openai' | 'anthropic' | 'local';
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;

  // Capabilities — what tools this agent can use
  tools: ToolDefinition[];

  // Constraints — what this agent is NOT allowed to do
  constraints: {
    maxTurns: number;              // prevent infinite loops
    allowedPaths?: string[];       // file paths the agent can touch
    blockedOperations?: string[];  // operations that require approval
    rateLimitPerMinute: number;    // cost control
    requireApproval?: string[];    // tool names that need user confirmation
  };
}
```

The system prompt is where you make the agent specific. A good system prompt:
- Defines the agent's role and expertise area
- Lists what it should and shouldn't do
- Specifies the output format (e.g., "respond in plain English, no code blocks unless the user asks")
- Establishes tone and personality
- Tells it what to do when it's unsure ("ask the user to clarify rather than guessing")

→ **For system prompt patterns and examples, read** [references/agent-config.md](references/agent-config.md)

## Frontend — The Chat Interface

The frontend's job is simple: send messages, display responses, and optionally show status updates when the agent is doing backend work.

### What to Build

1. **Chat input** — Text input with send button. Support multiline (Shift+Enter) and submit on Enter.
2. **Message list** — Scrollable container showing the conversation. User messages on one side, agent responses on the other.
3. **Streaming display** — Token-by-token rendering as the LLM generates its response. Use SSE (Server-Sent Events) or WebSocket.
4. **Status indicators** — When the agent is executing a tool on the backend, show "Searching files..." or "Applying changes..." so the user knows something is happening.
5. **Approval prompts** — For dangerous operations, the agent should ask for confirmation in the chat before proceeding.

### Framework Patterns

The chat UI works with any frontend framework. The core pattern is the same — the differences are in component structure and state management.

→ **For framework-specific implementations (React, Vue, Next.js, vanilla JS), read** [references/frontend-patterns.md](references/frontend-patterns.md)

### Streaming

Always stream responses. Waiting for the full response before showing anything feels broken to users, especially when tool calls add latency.

**SSE (Server-Sent Events)** is the simplest streaming approach and works for most cases:
```typescript
// Frontend: reading an SSE stream
const response = await fetch('/api/agent/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, conversationId }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  // Parse SSE events and append text to the current message
}
```

Use WebSockets instead of SSE when you need bidirectional communication — for example, if the agent needs to push status updates or approval requests while it's still thinking.

## Backend — Agent Orchestration

The backend is where the real work happens. This is where the agent's personality lives, where tool calls execute, and where code modifications are applied.

### API Route Structure

Keep it clean. Most agents need just 2-3 endpoints:

```
POST /api/agent/chat          → Main conversation endpoint (streaming response)
GET  /api/agent/conversations  → List past conversations (optional)
POST /api/agent/approve        → User approves a pending operation (if using approval flow)
```

### The Conversation Loop

The core backend logic is a loop: call the LLM, check if it wants to use tools, execute tools if so, feed results back, repeat until the LLM produces a final text response.

```typescript
async function handleAgentChat(message: string, conversationId: string, config: AgentConfig) {
  const history = await loadConversation(conversationId);
  history.push({ role: 'user', content: message });

  while (true) {
    const response = await callLLM(config, history);

    if (response.type === 'text') {
      // Final answer — stream this to the frontend
      yield { type: 'text', content: response.content };
      break;
    }

    if (response.type === 'tool_call') {
      // Agent wants to do something — execute it on the backend
      const toolResult = await executeToolCall(response.toolCall, config);
      history.push({ role: 'assistant', content: response.raw });
      history.push({ role: 'tool', content: toolResult });
      // Loop continues — LLM will process the tool result
    }
  }

  await saveConversation(conversationId, history);
}
```

### Tool Execution — Where Code Modifications Happen

Tools are how the agent interacts with the codebase and backend systems. Each tool is a function the agent can call, with defined inputs and outputs.

```typescript
interface ToolDefinition {
  name: string;
  description: string;          // Shown to the LLM so it knows when to use this tool
  parameters: JSONSchema;       // Input validation
  requiresApproval: boolean;    // Does the user need to confirm before execution?
  execute: (params: any) => Promise<ToolResult>;
}
```

Common tool categories for code-modifying agents:

| Category | Example Tools | Risk Level |
|---|---|---|
| **Read** | `readFile`, `searchCode`, `listDirectory`, `queryDatabase` | Low |
| **Write** | `editFile`, `createFile`, `runMigration` | High — use approval |
| **Execute** | `runCommand`, `runTests`, `deployPreview` | High — use approval |
| **Query** | `searchDocs`, `getAPIReference`, `checkStatus` | Low |

→ **For backend implementation patterns (Express, Fastify, Next.js API routes, etc.), read** [references/backend-patterns.md](references/backend-patterns.md)

### Security — Non-Negotiable

The agent runs on your backend with your permissions. Treat every tool call as potentially hostile input:

- **Validate all tool parameters** against the JSON schema before execution
- **Sandbox file operations** — restrict to allowed paths (`config.constraints.allowedPaths`). Path traversal (`../../etc/passwd`) must be caught.
- **Never execute raw shell commands** from agent output without sanitization and allowlisting
- **Rate limit** aggressively — both per user and per agent
- **Log everything** — every tool call, every file modification, every approval decision. You'll need the audit trail.
- **Use a separate service account** for agent operations with minimal permissions — not your admin credentials

### The Approval Flow

For operations that modify code or data, add a confirmation step:

1. Agent decides to call a write tool (e.g., `editFile`)
2. Backend pauses execution and sends an approval request to the frontend via the stream
3. Frontend shows "The agent wants to modify `src/config.ts` — [Approve] [Reject]"
4. User clicks Approve → Backend executes the tool, feeds result back to agent
5. User clicks Reject → Backend tells the agent the operation was denied, agent adjusts its approach

This keeps humans in the loop for anything consequential. For read-only tools, skip approval — it would make the agent feel sluggish for no safety benefit.

## Provider Integration

The skill supports multiple LLM providers. The backend should abstract the provider so you can switch without touching the rest of the code.

→ **For provider-specific integration (OpenAI, Anthropic, local models), read** [references/providers.md](references/providers.md)

The provider abstraction layer:
```typescript
interface LLMProvider {
  chat(messages: Message[], tools?: ToolDefinition[], config?: LLMConfig): AsyncIterable<StreamChunk>;
}
```

Each provider implements this interface. The agent orchestration code doesn't care which provider is behind it — it just calls `chat()` and processes the stream.

## Step-by-Step Implementation Order

When integrating an agent into an existing app, go in this order:

1. **Backend: Provider setup** — Get the LLM API call working. Hardcode a system prompt, send a message, get a response. Verify this works in isolation.
2. **Backend: Streaming endpoint** — Create the `/api/agent/chat` route. Stream the LLM response as SSE events.
3. **Frontend: Basic chat** — Build the simplest possible chat UI. Text input, message list, SSE reader. Connect to the endpoint. You should have a working (but dumb) chatbot at this point.
4. **Backend: Agent config** — Move the system prompt and model settings into an `AgentConfig` object. Make the system prompt specific to the agent's task.
5. **Backend: Tools (read-only first)** — Add tool definitions. Start with read-only tools (search files, query data). Test that the agent can call them and incorporate results into its answers.
6. **Backend: Tools (write operations)** — Add code modification tools. Implement the approval flow. Test with a safe operation before wiring up anything destructive.
7. **Frontend: Status + approval UI** — Show tool execution status in the chat. Add approval prompts for write operations.
8. **Hardening** — Rate limiting, input validation, error handling, logging, auth integration.

Each step should be testable on its own. If step 2 doesn't work, there's no point building step 3.

## Customizing the Agent for Specific Tasks

The whole point of this architecture is that agents are narrow and good at their job, not broad and mediocre. Here's how to customize:

### System Prompt Engineering

The system prompt is the strongest lever. It controls:
- **What the agent does** — "You are a database query assistant. You translate natural language questions into SQL queries and execute them."
- **What it refuses** — "Do not modify table schemas. Do not run DELETE or DROP statements. If asked, explain why you can't."
- **How it communicates** — "Keep responses concise. Show the SQL query you're about to run and ask for confirmation before executing."
- **Output format** — "When showing query results, format them as a markdown table. Limit to 20 rows."

### Tool Scoping

Don't give the agent every tool. A SQL assistant needs `queryDatabase` and `listTables` — not `editFile` or `runCommand`. Each tool you add is an attack surface and a source of confusion.

### Conversation Memory

Choose the right memory strategy:
- **Stateless** (each message is independent) — Simple, but the agent can't reference earlier messages
- **Window** (keep the last N messages) — Good default. Set N based on context window size and cost tolerance.
- **Summary** (LLM summarizes old messages into a compact context) — For long conversations. More complex to implement.
- **Persistent** (stored in database, loaded per session) — For agents that need to remember across sessions.

Window-based memory with N=20 is a solid starting point for most agents.

## Verification

Before considering the integration done:

1. **Send a message and verify the response streams** — no long pauses, text appears progressively
2. **Test each tool** — manually trigger each tool the agent has access to. Verify it works and the result feeds back correctly.
3. **Test the approval flow** — trigger a write operation, verify the approval prompt shows up, test both Approve and Reject paths.
4. **Test constraints** — try to make the agent do something outside its allowed scope. It should refuse.
5. **Test error handling** — kill the LLM connection mid-stream. Send malformed input. Pass a file path outside allowed directories. The system should handle all of these gracefully.
6. **Test rate limiting** — fire 50 requests in quick succession. Verify the rate limiter kicks in.
7. **Check the conversation history** — start a multi-turn conversation, verify context is maintained correctly.

If any of these fail, fix them before moving on. A broken approval flow is a security issue, not a nice-to-have.
