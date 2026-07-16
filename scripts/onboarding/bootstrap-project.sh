#!/usr/bin/env bash
set -euo pipefail
owner=""; title="Agent Queue"; apply=false
while [ "$#" -gt 0 ]; do case "$1" in --owner) owner="$2"; shift 2;; --title) title="$2"; shift 2;; --apply) apply=true; shift;; *) echo "Unknown argument: $1" >&2; exit 2;; esac; done
[ -n "${owner}" ] || { echo 'Usage: bootstrap-project.sh --owner ORGANIZATION [--title TITLE] [--apply]' >&2; exit 2; }
if [ "${apply}" != true ]; then echo "Would create Project V2 '${title}' for ${owner}; then use discover-project-config.sh to capture IDs."; exit 0; fi
gh project create --owner "${owner}" --title "${title}"
echo 'GitHub Project creation does not reliably expose Status-field mutations across gh versions. Create/verify the Status single-select field in the UI with: Triage, Ready, In Progress, In Review, Blocked, Done, Cancelled; then run discover-project-config.sh.'
