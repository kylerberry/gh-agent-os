# Triggering and rerunning agents

Apply a trigger label with GitHub or the CLI:

```sh
gh issue edit ISSUE_NUMBER --repo OWNER/REPO --add-label agent:research
gh issue edit ISSUE_NUMBER --repo OWNER/REPO --add-label agent:implement
```

To rerun a label-triggered workflow, remove and re-add the same label. Only implementation labels added by write/maintain/admin collaborators will proceed. Do not use manual dispatch for implementation: the workflow is deliberately label-triggered so the agent action receives issue context and reports its branch.

Use the Actions manual dispatch only for research. For PR revision, create one top-level comment whose first non-whitespace line is exactly `/agent fix-this`, followed by material, actionable bullets.
