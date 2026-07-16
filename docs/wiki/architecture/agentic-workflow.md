# Agentic workflow design

GitHub Issues are the task queue; GitHub Project V2 is optional lifecycle visualization. Labels are explicit triggers, not authorization. The implementation and revision workflows independently verify the actor has `write`, `maintain`, or `admin` access. A configured bot allowlist is only used for trusted review bots requesting revision.

## Contracts

| Stage | Trigger | Output | Human gate |
|---|---|---|---|
| Research | `agent:research` or manual dispatch | One updated `<!-- agent:research-spec -->` comment, or a structured blocker | Review spec / answer blocker |
| Implementation | `agent:implement` applied by maintainer | Same-repository `agent/issue-*` branch and PR, only if ahead of base | Review and merge |
| Revision | Top-level `/agent fix-this` | Commit(s) on the existing agent branch | Review revised PR |

All issue, PR, review, and comment text is untrusted task input. Prompts cannot override repository instructions. Context collectors cap comments and diff size to control prompt size.

## Optional Project status mapping

`opened → Triage`; `agent:implement → In Progress`; `agent:needs-human → Blocked`; agent PR opened → `In Review`; merged or completed issue → `Done`; not-planned closure → `Cancelled`.

The sync helper **does not add issues to a Project**. Use GitHub Project automation or add items manually; it safely skips items that are not already present.
