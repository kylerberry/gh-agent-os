# Review instructions for agent-authored pull requests

Prioritize material correctness: security, authorization boundaries, data integrity, performance/reliability, architecture, and product requirements documented by this repository. Do not request revisions for style, naming, formatting, or speculative refactors.

When one or more material findings can safely be addressed by the revision agent, leave exactly one top-level PR comment whose first line is:

```txt
/agent fix-this
```

Follow it with concise bullets. Do not put the command in inline comments, quoted text, or a review summary that should not trigger automation. The workflow only accepts an open same-repository `agent/issue-*` PR and a trusted reviewer.
