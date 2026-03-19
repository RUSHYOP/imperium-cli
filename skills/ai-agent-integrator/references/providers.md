# LLM Provider Integration

This reference covers how to integrate with the major LLM providers. The goal is to abstract the provider behind a common interface so the agent orchestration code doesn't need to know which provider is behind it.

---

## Table of Contents
1. [Provider Abstraction Layer](#provider-abstraction-layer)
2. [OpenAI / GPT](#openai--gpt)
3. [Anthropic / Claude](#anthropic--claude)
4. [Local Models (Ollama / vLLM)](#local-models)
5. [Provider Selection Guide](#provider-selection-guide)

---

## Provider Abstraction Layer

Every provider should implement this interface:

```typescript
interface StreamChunk {
  type: 'text' | 'tool_call' | 'error' | 'done';
  content?: string;
  toolCall?: { id: string; name: string; arguments: Record<string, any> };
  error?: string;
}

interface LLMProvider {
  chat(
    messages: Message[],
    tools?: ToolDefinition[],
    config?: { model: string; temperature: number; maxTokens: number }
  ): AsyncIterable<StreamChunk>;
}
```

Then the orchestration code just does:
```typescript
const provider = getProvider(agentConfig.provider); // returns LLMProvider
for await (const chunk of provider.chat(messages, tools, config)) {
  // handle chunk
}
```

---

## OpenAI / GPT

### Setup
```bash
npm install openai
```

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

### Streaming Chat with Tool Calling

```typescript
class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async *chat(messages, tools, config) {
    const openaiTools = tools?.map(t => ({
      type: 'function' as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));

    const stream = await this.client.chat.completions.create({
      model: config?.model ?? 'gpt-4o',
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        ...(m.toolCallId && { tool_call_id: m.toolCallId }),
      })),
      tools: openaiTools,
      temperature: config?.temperature ?? 0.7,
      max_tokens: config?.maxTokens ?? 4096,
      stream: true,
    });

    let currentToolCall: { id: string; name: string; args: string } | null = null;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      if (delta?.content) {
        yield { type: 'text', content: delta.content };
      }

      if (delta?.tool_calls?.[0]) {
        const tc = delta.tool_calls[0];
        if (tc.id) {
          // New tool call starting
          if (currentToolCall) {
            yield {
              type: 'tool_call',
              toolCall: {
                id: currentToolCall.id,
                name: currentToolCall.name,
                arguments: JSON.parse(currentToolCall.args),
              },
            };
          }
          currentToolCall = { id: tc.id, name: tc.function?.name ?? '', args: '' };
        }
        if (tc.function?.arguments) {
          currentToolCall!.args += tc.function.arguments;
        }
      }
    }

    // Flush any pending tool call
    if (currentToolCall) {
      yield {
        type: 'tool_call',
        toolCall: {
          id: currentToolCall.id,
          name: currentToolCall.name,
          arguments: JSON.parse(currentToolCall.args),
        },
      };
    }

    yield { type: 'done' };
  }
}
```

### Feeding Tool Results Back

OpenAI expects tool results as messages with `role: 'tool'` and a `tool_call_id`:

```typescript
messages.push({
  role: 'assistant',
  content: null,
  tool_calls: [{ id: toolCallId, type: 'function', function: { name, arguments: JSON.stringify(args) } }],
});
messages.push({
  role: 'tool',
  tool_call_id: toolCallId,
  content: JSON.stringify(toolResult),
});
```

### Key Notes
- `gpt-4o` is the default for tool-calling agents (best balance of capability and cost)
- `gpt-4o-mini` for simpler agents where cost matters more than capability
- Tool call arguments stream in chunks — accumulate them before parsing JSON
- Set `parallel_tool_calls: false` if tools have side effects that depend on order

---

## Anthropic / Claude

### Setup
```bash
npm install @anthropic-ai/sdk
```

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

### Streaming Chat with Tool Calling

```typescript
class AnthropicProvider implements LLMProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async *chat(messages, tools, config) {
    const anthropicTools = tools?.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters,
    }));

    // Anthropic uses a separate system parameter, not a system message
    const systemMessage = messages.find(m => m.role === 'system')?.content ?? '';
    const chatMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const stream = this.client.messages.stream({
      model: config?.model ?? 'claude-sonnet-4-20250514',
      system: systemMessage,
      messages: chatMessages,
      tools: anthropicTools,
      temperature: config?.temperature ?? 0.7,
      max_tokens: config?.maxTokens ?? 4096,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          yield { type: 'text', content: event.delta.text };
        }
        if (event.delta.type === 'input_json_delta') {
          // Tool input streaming — accumulate until content_block_stop
        }
      }

      if (event.type === 'content_block_stop') {
        const block = event; // check if this was a tool_use block
        // Handle completed tool call
      }

      if (event.type === 'message_delta') {
        if (event.delta.stop_reason === 'tool_use') {
          // Message ended because the model wants to use tools
          // Extract tool calls from the accumulated message
        }
      }
    }

    yield { type: 'done' };
  }
}
```

### Feeding Tool Results Back

Anthropic uses `tool_result` content blocks inside a user message:

```typescript
messages.push({
  role: 'assistant',
  content: [{ type: 'tool_use', id: toolCallId, name, input: args }],
});
messages.push({
  role: 'user',
  content: [{ type: 'tool_result', tool_use_id: toolCallId, content: JSON.stringify(toolResult) }],
});
```

### Key Notes
- Claude's system prompt is a separate parameter, not a message
- Claude tends to be more cautious with tool calls — good for write operations
- `claude-sonnet-4-20250514` is the go-to model for most agents (fast + capable)
- `claude-opus-4-20250514` for complex multi-step reasoning tasks
- Tool results go inside a `user` message with `tool_result` content blocks (different from OpenAI)

---

## Local Models

### Ollama

```bash
# Install Ollama, then pull a model
ollama pull llama3.1
```

```typescript
class OllamaProvider implements LLMProvider {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async *chat(messages, tools, config) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config?.model ?? 'llama3.1',
        messages,
        tools: tools?.map(t => ({
          type: 'function',
          function: { name: t.name, description: t.description, parameters: t.parameters },
        })),
        stream: true,
      }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n').filter(Boolean);
      for (const line of lines) {
        const data = JSON.parse(line);
        if (data.message?.content) {
          yield { type: 'text', content: data.message.content };
        }
        // Handle tool calls from Ollama's response format
      }
    }

    yield { type: 'done' };
  }
}
```

### Key Notes for Local Models
- Tool calling support varies by model — check before relying on it
- Latency is higher than cloud APIs unless you have good hardware (GPU)
- Good for development/testing or when data can't leave the network
- No API key costs, but you pay in compute
- Consider using a cloud provider for production and local models for development

---

## Provider Selection Guide

| Factor | OpenAI (GPT-4o) | Anthropic (Claude) | Local (Ollama) |
|---|---|---|---|
| Tool calling reliability | Excellent | Excellent | Model-dependent |
| Streaming | Yes | Yes | Yes |
| Latency | Low | Low | Varies (hardware) |
| Cost | Per-token | Per-token | Compute only |
| Data privacy | Cloud | Cloud | Full control |
| Best for | General agents, fast iteration | Careful/safe agents, complex reasoning | Privacy-sensitive, offline, dev/testing |

For most production agents: start with OpenAI or Anthropic. Use local models for development or when data sovereignty requires it.

If you need to support multiple providers (e.g., let the user choose), implement the `LLMProvider` interface for each and select at runtime based on the agent config.
