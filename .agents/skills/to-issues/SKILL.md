---
name: to-issues
description: Break a plan, spec, or PRD into independently implementable GitHub issues using tracer-bullet vertical slices. Use when asked to create implementation tickets or break work into issues.
icon: Sparkles
command: to-issues
---

# To Issues

Break a plan into independently grabbable, vertically sliced GitHub issues.

## Process

1. Gather the plan, issue, or PRD context. Inspect the repository enough to use its domain language and constraints.
2. Draft thin vertical slices: each should deliver one observable end-to-end behavior, be testable, and fit one focused branch and PR.
3. Mark human-gated slices as `agent:needs-human`; label ready-to-research slices `agent:research`; label clear, approved slices `agent:implement` only after a human explicitly authorizes implementation.
4. Present titles, goal, acceptance criteria, dependencies, risks, and recommended trigger label. Get user approval before publishing.
5. Create approved issues with `gh issue create`, in dependency order. Use the repository's type and risk labels where applicable. Do not close or modify parent issues.

## Issue body

```md
## Goal

<observable outcome>

## Scope

In scope:
- ...

Out of scope:
- ...

## Acceptance criteria

- [ ] ...

## Validation

- ...

## Risks / human-only inputs

- None known.

## Dependencies

- None — can start immediately.
```
