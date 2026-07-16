#!/usr/bin/env bash
set -euo pipefail
repo="${2:-}"; [ "${1:-}" = "--repo" ] && [ -n "${repo}" ] || { echo 'Usage: check-prerequisites.sh --repo OWNER/REPO' >&2; exit 2; }
for command in gh jq node; do command -v "${command}" >/dev/null || { echo "Missing required command: ${command}" >&2; exit 1; }; done
gh auth status --hostname github.com
gh repo view "${repo}" --json nameWithOwner,viewerPermission,isPrivate --jq '"Repository: " + .nameWithOwner + " | private: " + (.isPrivate|tostring) + " | your permission: " + .viewerPermission'
echo 'Prerequisites passed. Confirm the Claude GitHub App is installed before enabling agents.'
