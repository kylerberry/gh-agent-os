---
name: run-agent-issue
description: Trigger a configured GitHub issue agent by toggling its label. Use for `/run-agent-issue <agent> <issue>`, reruns, or requests to trigger `agent:research` or `agent:implement`.
---

# Run Agent Issue

Trigger an issue workflow by removing and re-adding its label.

## Inputs

```txt
/run-agent-issue <research|implement|agent:research|agent:implement> <issue-number|#number|issue-url>
```

Resolve the target repository from the issue URL, explicit user context, or `gh repo view --json nameWithOwner`. If it cannot be resolved safely, ask one concise question.

Supported labels: `agent:research` and `agent:implement` only.

## Command

Use two separate GitHub CLI calls, substituting resolved literal values:

```sh
gh issue edit <issue-number> --repo <owner/repo> --remove-label "<agent-label>"
gh issue edit <issue-number> --repo <owner/repo> --add-label "<agent-label>"
```

Report both operations. Do not change the issue body, workflow files, or repository settings.

## Notes

- `agent:implement` is label-triggered; do not use manual dispatch for implementation.
- The applying actor needs `write`, `maintain`, or `admin` access; the workflow verifies this independently.
- If `gh` authentication fails, report the error and direct the user to run `gh auth status --hostname github.com`.
