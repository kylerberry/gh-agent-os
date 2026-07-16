#!/usr/bin/env bash
set -euo pipefail
repo=""; apply=false
while [ "$#" -gt 0 ]; do case "$1" in --repo) repo="$2"; shift 2;; --apply) apply=true; shift;; *) echo "Unknown argument: $1" >&2; exit 2;; esac; done
[ -n "${repo}" ] || { echo 'Usage: configure-repo-variables.sh --repo OWNER/REPO [--apply]' >&2; exit 2; }
values='AGENT_RESEARCH_ENABLED=false
AGENT_IMPLEMENT_ENABLED=false
AGENT_EVAL_ENABLED=false
AGENT_PROJECT_SYNC_ENABLED=false
AGENT_BASE_BRANCH=main
AGENT_PR_REVISE_TRUSTED_BOT_ACTORS=github-copilot[bot],copilot-pull-request-reviewer[bot]'
printf '%s\n' "${values}" | while IFS='=' read -r name value; do
 if [ "${apply}" = true ]; then gh variable set "${name}" --repo "${repo}" --body "${value}"; else echo "Would set ${name}=${value}"; fi
done
echo 'Set model variables and Project IDs separately after validating their values. All agents remain disabled.'
