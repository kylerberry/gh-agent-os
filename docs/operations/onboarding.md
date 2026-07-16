# Onboarding

1. Start in a disposable repository. Copy the template only after reviewing its workflow permissions and agent tool allowlists for the target codebase.
2. Authenticate `gh`, run `check-prerequisites.sh`, then dry-run and apply labels and disabled variables.
3. Install the Claude GitHub App and add `CLAUDE_CODE_OAUTH_TOKEN`. Do not place production credentials in Actions secrets accessible to these workflows.
4. Set explicit model names in the three model variables. Enable `AGENT_RESEARCH_ENABLED=true` first and run a focused issue.
5. Add branch protection and verify that a human approval and CI are mandatory before enabling implementation.
6. Optionally create a Project, set up its Status options, run `discover-project-config.sh`, save returned IDs as repository variables, add `GH_PROJECT_TOKEN`, and only then enable Project sync.
7. Enable implementation last. Test blocked output, no-change behavior, PR creation, and a single `/agent fix-this` revision in a disposable repository.

