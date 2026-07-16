#!/usr/bin/env bash
set -euo pipefail

issue_number="${1:-}"
status_option_id="${2:-}"
repository="${GITHUB_REPOSITORY:-}"
project_id="${AGENT_PROJECT_ID:-}"
status_field_id="${AGENT_PROJECT_STATUS_FIELD_ID:-}"

if [ -z "${issue_number}" ] || [ -z "${status_option_id}" ]; then
  echo "::error::Usage: scripts/agents/project-status.sh <issue-number> <status-option-id>" >&2
  exit 1
fi
if [ -z "${repository}" ] || [ -z "${project_id}" ] || [ -z "${status_field_id}" ]; then
  echo "::error::GITHUB_REPOSITORY, AGENT_PROJECT_ID, and AGENT_PROJECT_STATUS_FIELD_ID are required." >&2
  exit 1
fi
if [ -z "${GH_PROJECT_TOKEN:-}" ]; then
  echo "::error::GH_PROJECT_TOKEN is required for GitHub Project status sync." >&2
  exit 1
fi

owner="${repository%%/*}"
repo="${repository#*/}"
export GH_TOKEN="${GH_PROJECT_TOKEN}"
query='query($owner: String!, $repo: String!, $number: Int!) { repository(owner: $owner, name: $repo) { issue(number: $number) { projectItems(first: 50) { nodes { id project { id } } } } } }'
response="$(gh api graphql -f query="${query}" -f owner="${owner}" -f repo="${repo}" -F number="${issue_number}")"
item_id="$(jq -r --arg project_id "${project_id}" '.data.repository.issue.projectItems.nodes[]? | select(.project.id == $project_id) | .id' <<<"${response}" | sed -n '1p')"
if [ -z "${item_id}" ]; then
  echo "::warning::Issue #${issue_number} is not on configured Project; status sync skipped." >&2
  exit 0
fi
mutation='mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) { updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {singleSelectOptionId: $optionId}}) { projectV2Item { id } } }'
gh api graphql -f query="${mutation}" -f projectId="${project_id}" -f itemId="${item_id}" -f fieldId="${status_field_id}" -f optionId="${status_option_id}" >/dev/null
echo "Synced issue #${issue_number} to configured Project status."
