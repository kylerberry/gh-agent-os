# Agent skills included with this factory

The repository ships local skills under `.agents/skills/`. Ensure the agent runtime loads repository-local skills when running in an agent sandbox.

- **`craft`** — applies a sequential phase-gate workflow. Use its lightweight flow for small configuration changes and its full Conceptualize → Render → Assess → Fix → Tighten → Sharpen flow for larger or trust-boundary changes.
- **`run-agent-issue`** — safely triggers or reruns research and implementation workflows by removing and reapplying the appropriate issue label through `gh`; it resolves the target repository rather than assuming one.
- **`tdd`** — guides test-first, vertical-slice development: one observable behavior, one failing test, the minimum passing implementation, then refactoring. Its companion guides cover tests, mocking, interfaces, refactoring, and deep modules.
- **`to-issues`** — converts approved plans into focused GitHub issues with acceptance criteria, validation, dependencies, and the factory's human/research/implementation label gates.

These skills guide agent behavior; GitHub Actions authorization, branch restrictions, and human merge requirements remain the enforcement layer.
