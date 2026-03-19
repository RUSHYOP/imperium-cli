# Frontend Chat Patterns

Framework-specific implementations for the chat UI. Pick the one that matches your project.

---

## Table of Contents
1. [React (standalone)](#react)
2. [Next.js (App Router)](#nextjs-app-router)
3. [Vue 3](#vue-3)
4. [Vanilla JS / Web Components](#vanilla-js)
5. [Shared Patterns](#shared-patterns)

---

## React

### Chat Hook

```typescript
// hooks/useAgentChat.ts
import { useState, useCallback, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'status';
  content: string;
  pending?: boolean;
  approval?: { toolName: string; description: string; toolCallId: string };
}

export function useAgentChat(agentId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content };
    const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', pending: true };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    abortRef.current = new AbortController();

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, message: content }),
        signal: abortRef.current.signal,
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const events = parseSSEEvents(text);

        for (const event of events) {
          if (event.type === 'text') {
            setMessages(prev =>
              prev.map(m => m.id === assistantMsg.id
                ? { ...m, content: m.content + event.data }
                : m
              )
            );
          }
          if (event.type === 'status') {
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: 'status',
              content: event.data,
            }]);
          }
          if (event.type === 'approval_required') {
            const approval = JSON.parse(event.data);
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: `I'd like to: **${approval.description}**`,
              approval: { toolName: approval.toolName, description: approval.description, toolCallId: approval.toolCallId },
            }]);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        }]);
      }
    } finally {
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, pending: false } : m));
      setIsStreaming(false);
    }
  }, [agentId]);

  const approveAction = useCallback(async (toolCallId: string) => {
    await fetch('/api/agent/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolCallId, approved: true }),
    });
  }, []);

  const rejectAction = useCallback(async (toolCallId: string) => {
    await fetch('/api/agent/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolCallId, approved: false }),
    });
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, isStreaming, sendMessage, approveAction, rejectAction, stop };
}
```

### Chat Component

```tsx
// components/AgentChat.tsx
function AgentChat({ agentId }: { agentId: string }) {
  const { messages, isStreaming, sendMessage, approveAction, rejectAction, stop } = useAgentChat(agentId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="agent-chat">
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message message--${msg.role}`}>
            {msg.role === 'status' ? (
              <div className="status-indicator">{msg.content}</div>
            ) : (
              <div className="message-content">{msg.content}</div>
            )}
            {msg.approval && (
              <div className="approval-prompt">
                <button onClick={() => approveAction(msg.approval!.toolCallId)}>Approve</button>
                <button onClick={() => rejectAction(msg.approval!.toolCallId)}>Reject</button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
        />
        {isStreaming ? (
          <button type="button" onClick={stop}>Stop</button>
        ) : (
          <button type="submit" disabled={!input.trim()}>Send</button>
        )}
      </form>
    </div>
  );
}
```

---

## Next.js (App Router)

Next.js uses the same React patterns above, but with some specifics:

### API Route (app/api/agent/chat/route.ts)

```typescript
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { agentId, message } = await req.json();

  // Load agent config, call LLM, etc.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // For each chunk from the LLM:
      controller.enqueue(encoder.encode(`event: text\ndata: ${chunk}\n\n`));

      // When done:
      controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Using the AI SDK (optional)

Next.js projects can use Vercel's `ai` SDK for a higher-level abstraction:

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic
```

```typescript
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: agentConfig.systemPrompt,
    messages,
    tools: {
      searchCode: tool({
        description: 'Search the codebase for a pattern',
        parameters: z.object({ query: z.string() }),
        execute: async ({ query }) => { /* ... */ },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

The AI SDK handles streaming, tool calling, and message formatting. It's a good shortcut if you're already in the Next.js ecosystem.

---

## Vue 3

### Composable

```typescript
// composables/useAgentChat.ts
import { ref, type Ref } from 'vue';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'status';
  content: string;
  approval?: { toolCallId: string; description: string };
}

export function useAgentChat(agentId: string) {
  const messages: Ref<Message[]> = ref([]);
  const isStreaming = ref(false);

  async function sendMessage(content: string) {
    messages.value.push({ id: crypto.randomUUID(), role: 'user', content });
    const assistantId = crypto.randomUUID();
    messages.value.push({ id: assistantId, role: 'assistant', content: '' });
    isStreaming.value = true;

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, message: content }),
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        // Parse SSE and append to the assistant message
        const msg = messages.value.find(m => m.id === assistantId);
        if (msg) msg.content += parseTextFromSSE(text);
      }
    } finally {
      isStreaming.value = false;
    }
  }

  return { messages, isStreaming, sendMessage };
}
```

---

## Vanilla JS

For projects without a framework, or for embedding the chat as a widget:

```html
<div id="agent-chat">
  <div id="messages"></div>
  <form id="chat-form">
    <textarea id="chat-input" placeholder="Type a message..." rows="1"></textarea>
    <button type="submit">Send</button>
  </form>
</div>

<script>
  const messagesEl = document.getElementById('messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = input.value.trim();
    if (!content) return;
    input.value = '';

    appendMessage('user', content);
    const assistantEl = appendMessage('assistant', '');

    const response = await fetch('/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantEl.textContent += decoder.decode(value);
    }
  });

  function appendMessage(role, content) {
    const div = document.createElement('div');
    div.className = `message message--${role}`;
    div.textContent = content;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }
</script>
```

---

## Shared Patterns

### SSE Event Parsing

```typescript
function parseSSEEvents(raw: string): Array<{ type: string; data: string }> {
  const events: Array<{ type: string; data: string }> = [];
  const lines = raw.split('\n');
  let currentEvent = { type: '', data: '' };

  for (const line of lines) {
    if (line.startsWith('event: ')) {
      currentEvent.type = line.slice(7);
    } else if (line.startsWith('data: ')) {
      currentEvent.data = line.slice(6);
    } else if (line === '') {
      if (currentEvent.type) {
        events.push({ ...currentEvent });
        currentEvent = { type: '', data: '' };
      }
    }
  }
  return events;
}
```

### Auto-Resize Textarea

```typescript
function autoResize(textarea: HTMLTextAreaElement) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}
```

### Markdown Rendering

Agent responses often contain markdown (bold, code blocks, lists). Use a lightweight renderer:

```bash
npm install marked dompurify
```

```typescript
import { marked } from 'marked';
import DOMPurify from 'dompurify';

function renderMarkdown(text: string): string {
  return DOMPurify.sanitize(marked.parse(text));
}
```

Always sanitize rendered HTML to prevent XSS from agent output.
