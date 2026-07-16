#!/usr/bin/env bash
set -euo pipefail
owner="${2:-}"; number="${4:-}"
[ "${1:-}" = "--owner" ] && [ "${3:-}" = "--project-number" ] && [ -n "${owner}" ] && [ -n "${number}" ] || { echo 'Usage: discover-project-config.sh --owner OWNER --project-number N' >&2; exit 2; }
query='query($login: String!, $number: Int!) { organization(login: $login) { projectV2(number: $number) { id fields(first: 50) { nodes { ... on ProjectV2SingleSelectField { id name options { id name } } } } } } }'
gh api graphql -f query="${query}" -f login="${owner}" -F number="${number}" | jq '.data.organization.projectV2 | {project_id: .id, status_field: ([.fields.nodes[] | select(.name == "Status")][0])}'
