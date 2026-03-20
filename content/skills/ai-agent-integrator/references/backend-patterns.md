# Backend Agent Patterns

Server-side implementation patterns for the agent orchestration layer. This is where tool calls execute, code gets modified, and the approval flow lives.

---

## Table of Contents
1. [Express.js](#expressjs)
2. [Fastify](#fastify)
3. [Next.js API Routes](#nextjs-api-routes)
4. [Tool Implementation](#tool-implementation)
5. [Approval Flow](#approval-flow)
6. [Conversation Storage](#conversation-storage)
7. [Security Middleware](#security-middleware)

---

## Express.js

### Streaming Endpoint

```typescript
import express from 'express';
import { AgentOrchestrator } from './agent/orchestrator';

const app = express();
app.use(express.json());

app.post('/api/agent/chat', async (req, res) => {
  const { agentId, message, conversationId } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const agent = new AgentOrchestrator(agentId);

  try {
    for await (const event of agent.run(message, conversationId)) {
      res.write(`event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`);
    }
    res.write(`event: done\ndata: {}\n\n`);
  } catch (err) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: 'Internal error' })}\n\n`);
  } finally {
    res.end();
  }
});
```

### Approval Endpoint

```typescript
app.post('/api/agent/approve', async (req, res) => {
  const { toolCallId, approved } = req.body;
  const result = await ApprovalStore.resolve(toolCallId, approved);
  res.json({ status: 'ok', result });
});
```

---

## Fastify

```typescript
import Fastify from 'fastify';

const app = Fastify();

app.post('/api/agent/chat', async (request, reply) => {
  const { agentId, message, conversationId } = request.body as any;

  reply.raw.setHeader('Content-Type', 'text/event-stream');
  reply.raw.setHeader('Cache-Control', 'no-cache');
  reply.raw.setHeader('Connection', 'keep-alive');

  const agent = new AgentOrchestrator(agentId);

  for await (const event of agent.run(message, conversationId)) {
    reply.raw.write(`event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`);
  }

  reply.raw.write(`event: done\ndata: {}\n\n`);
  reply.raw.end();
});
```

---

## Next.js API Routes

See the frontend-patterns reference for the App Router version. For Pages Router:

```typescript
// pages/api/agent/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { agentId, message, conversationId } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const agent = new AgentOrchestrator(agentId);

  for await (const event of agent.run(message, conversationId)) {
    res.write(`event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`);
  }

  res.write(`event: done\ndata: {}\n\n`);
  res.end();
}

export const config = { api: { bodyParser: true } };
```

---

## Tool Implementation

### Core Tool Structure

```typescript
interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  register(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  getDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  async execute(name: string, params: any, config: AgentConfig): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) return { success: false, error: `Unknown tool: ${name}` };

    // Validate parameters
    const valid = validateAgainstSchema(params, tool.parameters);
    if (!valid) return { success: false, error: 'Invalid parameters' };

    // Check constraints
    if (config.constraints.blockedOperations?.includes(name)) {
      return { success: false, error: `Operation ${name} is not allowed for this agent` };
    }

    return tool.execute(params);
  }
}
```

### Example: File Read Tool (Low Risk)

```typescript
const readFileTool: ToolDefinition = {
  name: 'readFile',
  description: 'Read the contents of a file at the given path',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'Relative file path' },
    },
    required: ['path'],
  },
  requiresApproval: false,
  execute: async ({ path }) => {
    const safePath = resolveSafePath(path, allowedPaths);
    if (!safePath) return { success: false, error: 'Path not allowed' };

    try {
      const content = await fs.readFile(safePath, 'utf-8');
      return { success: true, data: content };
    } catch {
      return { success: false, error: 'File not found' };
    }
  },
};
```

### Example: File Edit Tool (High Risk — Requires Approval)

```typescript
const editFileTool: ToolDefinition = {
  name: 'editFile',
  description: 'Replace a specific string in a file with new content',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'Relative file path' },
      oldContent: { type: 'string', description: 'The exact text to find and replace' },
      newContent: { type: 'string', description: 'The replacement text' },
    },
    required: ['path', 'oldContent', 'newContent'],
  },
  requiresApproval: true,
  execute: async ({ path, oldContent, newContent }) => {
    const safePath = resolveSafePath(path, allowedPaths);
    if (!safePath) return { success: false, error: 'Path not allowed' };

    const fileContent = await fs.readFile(safePath, 'utf-8');
    if (!fileContent.includes(oldContent)) {
      return { success: false, error: 'Old content not found in file' };
    }

    const updated = fileContent.replace(oldContent, newContent);
    await fs.writeFile(safePath, updated, 'utf-8');
    return { success: true, data: { path, linesChanged: newContent.split('\n').length } };
  },
};
```

### Example: Database Query Tool

```typescript
const queryDatabaseTool: ToolDefinition = {
  name: 'queryDatabase',
  description: 'Execute a read-only SQL query against the database',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'SQL SELECT query to execute' },
    },
    required: ['query'],
  },
  requiresApproval: false,
  execute: async ({ query }) => {
    // Only allow SELECT statements
    const normalized = query.trim().toUpperCase();
    if (!normalized.startsWith('SELECT')) {
      return { success: false, error: 'Only SELECT queries are allowed' };
    }

    try {
      const rows = await db.query(query);
      return { success: true, data: rows.slice(0, 100) }; // Limit to 100 rows
    } catch (err) {
      return { success: false, error: `Query failed: ${(err as Error).message}` };
    }
  },
};
```

---

## Approval Flow

The approval flow pauses agent execution when a tool requires human confirmation.

### Implementation

```typescript
// ApprovalStore — in-memory for simplicity, use Redis for production
class ApprovalStore {
  private static pending = new Map<string, {
    resolve: (approved: boolean) => void;
    timeout: NodeJS.Timeout;
  }>();

  static async waitForApproval(toolCallId: string, timeoutMs = 300000): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.pending.delete(toolCallId);
        resolve(false); // Auto-reject on timeout
      }, timeoutMs);

      this.pending.set(toolCallId, { resolve, timeout });
    });
  }

  static resolve(toolCallId: string, approved: boolean) {
    const entry = this.pending.get(toolCallId);
    if (!entry) return { error: 'No pending approval found' };
    clearTimeout(entry.timeout);
    entry.resolve(approved);
    this.pending.delete(toolCallId);
    return { approved };
  }
}
```

### Integration with the Agent Loop

```typescript
async function* runAgent(message, conversationId, config) {
  // ... LLM call and tool loop ...

  if (response.type === 'tool_call') {
    const tool = toolRegistry.get(response.toolCall.name);

    if (tool.requiresApproval) {
      const toolCallId = crypto.randomUUID();

      // Send approval request to frontend
      yield {
        type: 'approval_required',
        data: {
          toolCallId,
          toolName: tool.name,
          description: `${tool.name}(${JSON.stringify(response.toolCall.arguments)})`,
        },
      };

      // Wait for user response
      const approved = await ApprovalStore.waitForApproval(toolCallId);

      if (!approved) {
        // Tell the LLM the user rejected the operation
        history.push({ role: 'tool', content: 'User rejected this operation.' });
        continue;
      }
    }

    // Execute the tool
    yield { type: 'status', data: { message: `Running ${tool.name}...` } };
    const result = await toolRegistry.execute(tool.name, response.toolCall.arguments, config);
    history.push({ role: 'tool', content: JSON.stringify(result) });
  }
}
```

---

## Conversation Storage

### In-Memory (Development)

```typescript
const conversations = new Map<string, Message[]>();

function loadConversation(id: string): Message[] {
  return conversations.get(id) ?? [];
}

function saveConversation(id: string, messages: Message[]) {
  conversations.set(id, messages);
}
```

### Database (Production)

```typescript
// Using any SQL database
async function loadConversation(id: string): Promise<Message[]> {
  const rows = await db.query(
    'SELECT role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at',
    [id]
  );
  return rows.map(r => ({ role: r.role, content: r.content }));
}

async function saveMessage(conversationId: string, message: Message) {
  await db.query(
    'INSERT INTO messages (id, conversation_id, role, content) VALUES ($1, $2, $3, $4)',
    [crypto.randomUUID(), conversationId, message.role, message.content]
  );
}
```

### Window-Based Memory (Recommended Default)

```typescript
function trimToWindow(messages: Message[], windowSize = 20): Message[] {
  const systemMessages = messages.filter(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system');

  if (chatMessages.length <= windowSize) return messages;

  // Keep system messages + last N chat messages
  return [...systemMessages, ...chatMessages.slice(-windowSize)];
}
```

---

## Security Middleware

### Path Sanitization

```typescript
import path from 'path';

function resolveSafePath(userPath: string, allowedPaths: string[]): string | null {
  // Resolve to absolute path
  const resolved = path.resolve(process.cwd(), userPath);

  // Check it's within an allowed directory
  const isAllowed = allowedPaths.some(allowed => {
    const allowedAbs = path.resolve(process.cwd(), allowed);
    return resolved.startsWith(allowedAbs + path.sep) || resolved === allowedAbs;
  });

  if (!isAllowed) return null;

  // Reject paths with traversal components even if resolved path looks safe
  if (userPath.includes('..')) return null;

  return resolved;
}
```

### Rate Limiting

```typescript
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const entry = rateLimits.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= maxPerMinute) return false;
  entry.count++;
  return true;
}
```

For production, use Redis-based rate limiting (e.g., `rate-limiter-flexible` package) instead of in-memory.

### Request Validation

```typescript
import { z } from 'zod';

const chatRequestSchema = z.object({
  agentId: z.string().min(1).max(100),
  message: z.string().min(1).max(10000),
  conversationId: z.string().uuid().optional(),
});

// In your route handler:
const parsed = chatRequestSchema.safeParse(req.body);
if (!parsed.success) {
  return res.status(400).json({ error: 'Invalid request', details: parsed.error.issues });
}
```
