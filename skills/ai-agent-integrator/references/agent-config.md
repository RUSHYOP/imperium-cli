# Agent Configuration & System Prompts

How to define, scope, and customize agents so they do exactly what you need and nothing more.

---

## Configuration Storage

Agent configs should live on the backend, not in the frontend. Two common patterns:

### File-Based (Simple, good for single-agent setups)

```
config/
├── agents/
│   ├── sql-assistant.json
│   ├── code-reviewer.json
│   └── doc-writer.json
```

```json
{
  "id": "sql-assistant",
  "name": "SQL Query Assistant",
  "description": "Translates natural language to SQL and runs queries",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "temperature": 0.3,
  "maxTokens": 4096,
  "systemPrompt": "...",
  "tools": ["queryDatabase", "listTables", "describeTable"],
  "constraints": {
    "maxTurns": 10,
    "rateLimitPerMinute": 20,
    "blockedOperations": ["editFile", "runCommand"]
  }
}
```

### Database-Backed (For multi-tenant or user-customizable agents)

```sql
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  temperature REAL DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,
  tools JSONB DEFAULT '[]',
  constraints JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## System Prompt Patterns

The system prompt is the most powerful customization lever. A well-written system prompt turns a generic LLM into a focused tool.

### Pattern 1: Task-Specific Assistant

```
You are a SQL query assistant for the {app_name} analytics dashboard.

Your job:
- Translate the user's natural language questions into SQL queries
- Run those queries using the queryDatabase tool
- Present the results in a clear, readable format

Your database has these tables: {table_list}

Rules:
- Only run SELECT queries. Never modify data.
- If a query would return more than 100 rows, add a LIMIT clause and tell the user.
- If you're not sure what the user means, ask for clarification.
- Format numbers with commas and dates in a human-readable format.
- If a query fails, explain what went wrong in plain English.

Response format:
- Show the SQL query you're running (in a code block)
- Show the results as a markdown table
- Add a brief one-line summary of what the data shows
```

### Pattern 2: Code Modifier with Guardrails

```
You are a backend configuration assistant for {project_name}.

Your job:
- Help users update configuration files, environment variables, and settings
- Explain what each configuration change does before applying it

What you CAN modify:
- Files in config/ directory
- .env and .env.* files
- package.json scripts section

What you CANNOT modify:
- Source code in src/
- Database schemas
- Authentication or security settings

Before any file edit:
1. Read the current file content
2. Explain what you're going to change and why
3. Wait for the user to confirm (the system will show an approval prompt)
4. Apply the change

Response style:
- Be concise and direct
- Use code blocks when showing changes
- If something could break the app, warn the user clearly
```

### Pattern 3: Read-Only Knowledge Agent

```
You are a documentation assistant for the {product_name} platform.

You answer questions about the codebase, architecture, and API by reading files and searching the docs.

Available tools:
- readFile: Read any file in the project
- searchCode: Search for patterns across the codebase

You do NOT modify any files. Your role is purely informational.

When answering:
- Reference specific files and line numbers when possible
- If you're not sure about something, say so rather than guessing
- If the user's question requires looking at code, read the relevant files first

Response format:
- Keep answers focused and practical
- Use code blocks for code references
- Link to files by their relative path
```

### Pattern 4: Multi-Step Workflow Agent

```
You are a deployment assistant for {project_name}.

You help users deploy their code through a multi-step process.
Each step must complete successfully before moving to the next.

Deployment steps:
1. Run tests (using runCommand tool with "npm test")
2. Build the project (using runCommand tool with "npm run build")
3. Check the build output (using readFile to verify dist/ contents)
4. Deploy to staging (using deployPreview tool)
5. Report the staging URL to the user

Important:
- If ANY step fails, stop and report the error. Do not continue.
- Always show the output of each step to the user.
- Steps 1, 2, and 4 require user approval before running.
- After step 5, ask the user if they want to promote to production.
```

---

## Dynamic System Prompt Variables

System prompts work better when they include project-specific context. Inject variables at runtime:

```typescript
function buildSystemPrompt(template: string, context: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => context[key] ?? `{${key}}`);
}

// Usage:
const prompt = buildSystemPrompt(agentConfig.systemPrompt, {
  app_name: 'Analytics Pro',
  table_list: 'users, orders, products, sessions',
  project_name: 'my-saas-app',
});
```

This keeps the system prompt template generic (reusable across projects) while making it specific at runtime.

---

## Tool Set Design

### Principle: Minimum Viable Tool Set

Give the agent only the tools it needs. Every extra tool:
- Increases the chance the agent picks the wrong one
- Expands the attack surface
- Makes the system prompt longer (costs tokens)

### Example Tool Sets by Agent Type

**Data Query Agent:**
- `listTables` — List available tables
- `describeTable` — Get column names and types
- `queryDatabase` — Run a SELECT query

**Code Review Agent:**
- `readFile` — Read source files
- `searchCode` — Search for patterns
- `listDirectory` — Browse the file tree

**Configuration Agent:**
- `readFile` — Read current config
- `editFile` — Modify config files (requires approval)
- `listDirectory` — Browse config directory

**Deployment Agent:**
- `runCommand` — Run build/test/deploy commands (requires approval)
- `readFile` — Check build output
- `deployPreview` — Deploy to staging (requires approval)

---

## Constraint Patterns

### Turn Limits
Prevent infinite tool-calling loops:
```json
"maxTurns": 10
```
If the agent reaches the turn limit, force it to produce a text response summarizing what happened.

### Path Restrictions
Restrict file access to specific directories:
```json
"allowedPaths": ["src/config/", ".env", "package.json"]
```

### Operation Blocklists
Some tools are available but specific operations are blocked:
```json
"blockedOperations": ["DROP", "DELETE", "TRUNCATE"]
```
Check operation content (not just tool name) against blocklists.

### Approval Requirements
Tools that need user confirmation:
```json
"requireApproval": ["editFile", "runCommand", "deployPreview"]
```
Read-only tools skip approval to maintain conversational flow.

---

## Multi-Agent Configuration

When a single agent can't cover the scope, use multiple specialized agents with a router:

```json
{
  "router": {
    "model": "gpt-4o-mini",
    "systemPrompt": "Route to the appropriate specialist. Respond with only the agent ID.",
    "agents": ["sql-assistant", "code-reviewer", "deployment-agent"]
  }
}
```

The router agent is cheap (use a smaller model) and just picks which specialist handles the request. Each specialist has its own full config.

Only use multi-agent when a single agent legitimately can't handle the scope. Most apps only need one well-configured agent.
