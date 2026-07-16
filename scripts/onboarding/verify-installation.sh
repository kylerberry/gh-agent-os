#!/usr/bin/env bash
set -euo pipefail
repo="${2:-}"; [ "${1:-}" = "--repo" ] && [ -n "${repo}" ] || { echo 'Usage: verify-installation.sh --repo OWNER/REPO' >&2; exit 2; }
gh workflow list --repo "${repo}"
echo 'Repository variables:'
gh variable list --repo "${repo}"
echo 'Expected secret names (values are never displayed): CLAUDE_CODE_OAUTH_TOKEN; GH_PROJECT_TOKEN only if Project sync is enabled.'
echo 'Manual checks: Claude App installed; Actions may create PRs; base branch requires human review and CI; run research in a disposable issue before enabling implementation.'
