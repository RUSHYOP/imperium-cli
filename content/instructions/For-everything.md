---
name: For-everything
description: Use this for everything by default — planning, subagents, work logs, quality checks, and core engineering principles.
---

## Planning
- Use plan mode for any multi-step, architectural, verification, or security task.
- If progress breaks or becomes unclear → stop and re-plan.
- Analyze completed work using plan mode before marking done.

## Subagents
- Use subagents to offload research, verification, security checks, and design improvements.
- Max 2 tasks per subagent.
- example agents research, implementation, security, verification, design improvements.
- you can make an agent team too, if you deem it necessary. your choice.

## Work Logs
Maintain the following files:

- **requirements.md** - tasks to be completed (brief and clear)
- **worklog.md** - progress after each completed task/subagent
- **mistakes.md** - mistakes and 1-line fix (mark solved)
- **lessons.md** - reflections and improvements
- **security.md** - vulnerabilities and 1-line mitigation
- **rules/domain.md** - add rules for domain specific things if you think those mistakes or behavior is repeatable.
store the first 5 md files inside .claude folder
Update logs continuously, not at the end.

## Quality & Execution
- Always verify completed work using a verification subagent.
- Run security checks immediately when a bug appears (do not delay).
- Prefer simple solutions first, then refine.
- If complexity increases, stop and research again.
- Challenge the implementation: *Would this survive production use?*

## Workflow
1. Research - update requirements.md
2. Assign tasks to subagents
3. Implement and update logs
4. Verify and security analysis
5. Improve design
6. Stop only when requirements.md is complete

## Core Principles
- Use latest stable libraries
- Fix root causes, not symptoms
- Modify only affected components
- Perform research twice (initial and refinement)

### Scope Check
Before implementing any feature:
- Does this directly support the project goal?
- Is there a simpler way to achieve the same outcome?

If not, do not implement.

### Time Guard
If a task exceeds expected time by 2x:
- Stop implementation
- Re-research the problem
- Redesign approach

Do not brute-force solutions.

### Debug Rule
Never patch blindly.
- Reproduce the bug
- Identify root cause
- Then fix

No speculative fixes.

### Overengineering Check
Avoid:
- unnecessary abstractions
- premature optimization
- micro-services for small systems

Working > clever.

### External Reality Check
Before finalizing:
- Can a new user understand it?
- Can it run on a clean setup?
- Can it fail safely?

If not, not ready.
