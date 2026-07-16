# Copilot review instructions

## Review posture

Bias toward agreement and acceptance. Do not block on naming, formatting, style, or speculative refactors when the change is understandable and consistent with the repository.

Leave review comments only when they identify material risk or materially improve correctness. Prefer one clear blocking request over many small comments.

## High-value review areas

Prioritize:

1. **Security** — authentication and authorization boundaries, secret handling, input validation, injection, unsafe deserialization, and data exposure.
2. **Architecture** — documented domain boundaries, repository conventions, public API contracts, and avoiding business logic in inappropriate layers.
3. **Performance and reliability** — unbounded work, unsafe retries, race conditions, missing idempotency, resource exhaustion, and partial-failure handling.
4. **Data integrity** — transactional boundaries, concurrent writes, destructive migrations, compatibility, and durable audit requirements.
5. **Product correctness** — the issue acceptance criteria and the repository's documented behavior and constraints.

## Agent revision trigger

When review finds material security, performance/reliability, architecture, data-integrity, or product-correctness issues that the implementation agent can safely fix, leave exactly one high-level, top-level PR comment starting with this exact first line:

```txt
/agent fix-this
```

Below the command, list only the concise, material requested changes. This triggers the PR revision workflow.

- Do not put `/agent fix-this` in inline comments or review threads.
- Do not use it for style, naming, formatting, preference comments, or speculative improvements.
- Do not leave multiple trigger comments in one review pass; consolidate all agent-fixable material changes into one comment.
- If inline comments provide context for material findings, still add the single top-level trigger comment.

## Avoid commenting on

- subjective style or naming when clear enough;
- refactors unrelated to the changed behavior;
- speculative abstractions;
- test organization unless it conceals missing coverage;
- agent orchestration internals unless the pull request changes them.

If uncertain, prefer no comment unless the finding affects security, data integrity, production reliability, architecture, or documented product behavior.
