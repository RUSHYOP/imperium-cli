---
name: automation-guidance
description: Guidance for practical local automation using Playwright and helper scripts. Use when users want browser automation, UI checks, scripted validation flows, screenshots, or repeatable interaction workflows for local apps.
---

# Automation Guidance

Use this skill to build reliable local automation flows quickly, with emphasis on reconnaissance before action and script reuse over ad hoc one-offs.

## When to Use

- Browser automation for local web apps
- Repeatable UI validation flows
- Screenshot-based verification and debugging
- DOM/selector discovery before implementing actions
- Multi-service startup plus automation in one run

## Core Workflow

1. Inspect first, automate second.
2. Prefer helper scripts in `scripts/` before custom glue code.
3. Wait for app readiness (`networkidle` or explicit selectors) before element inspection.
4. Keep automation scripts focused on browser actions and assertions.

## Available Helper

- `scripts/with_server.py`: runs one or more servers, waits for ports, then executes your automation script.

Always run `--help` first:

```bash
python scripts/with_server.py --help
```

## Typical Patterns

### Single service + automation

```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

### Multiple services + automation

```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

### Minimal Playwright script

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    # add interactions/assertions here
    browser.close()
```

## Reconnaissance Pattern

Before writing selectors or assertions:

1. Load the page and wait for app readiness.
2. Capture current UI state (screenshot, HTML snapshot, visible controls).
3. Identify stable selectors.
4. Implement action/assertion steps with explicit waits.

## Guardrails

- Do not inspect dynamic pages before readiness checks.
- Do not hardcode brittle selectors when role/text/test-id options exist.
- Do not duplicate helper behavior in custom scripts unless necessary.

## Good Defaults

- Use `sync_playwright()` for concise scripts.
- Launch Chromium in headless mode unless visual debugging is required.
- Close browser instances explicitly.
- Keep flows deterministic with waits tied to expected UI outcomes.

## Included References

Examples in `examples/`:

- `element_discovery.py`
- `static_html_automation.py`
- `console_logging.py`