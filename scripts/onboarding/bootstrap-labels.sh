#!/usr/bin/env bash
set -euo pipefail
repo=""; apply=false
while [ "$#" -gt 0 ]; do case "$1" in --repo) repo="$2"; shift 2;; --apply) apply=true; shift;; *) echo "Unknown argument: $1" >&2; exit 2;; esac; done
[ -n "${repo}" ] || { echo 'Usage: bootstrap-labels.sh --repo OWNER/REPO [--apply]' >&2; exit 2; }
labels='agent:research|0E8A16|Run read-only issue research
agent:implement|1D76DB|Run implementation after human approval
agent:eval|5319E7|Reserved for an optional evaluator
agent:needs-human|D93F0B|Human decision or action required
type:feature|1D76DB|New user-visible capability
type:bug|D73A4A|Defect correction
type:refactor|BFDADC|Internal restructuring
type:docs|0075CA|Documentation change
type:chore|C5DEF5|Maintenance work
risk:business-critical|B60205|Material business decision or impact
risk:security|B60205|Security-sensitive work
risk:data|B60205|Data integrity or migration risk
risk:infra|B60205|Infrastructure or operational risk'
printf '%s\n' "${labels}" | while IFS='|' read -r name color description; do
  if [ "${apply}" = true ]; then gh label create "${name}" --repo "${repo}" --color "${color}" --description "${description}" --force; else echo "Would create/update label: ${name}"; fi
done
