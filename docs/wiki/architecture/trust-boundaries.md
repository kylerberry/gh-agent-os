# Trust boundaries and rollout controls

Implementation and revision runs have `contents: write` and may create branches and PRs. This is intentionally constrained by maintainer authorization, same-repository agent branch checks, no merge capability, a human merge gate, and a remote-head comparison before revision pushes.

Keep secrets out of issue bodies, prompts, logs, and the working tree. `GH_PROJECT_TOKEN` is optional and should be scoped to only the target Project and repository. Require SSO authorization where applicable.

Review third-party action versions regularly. For high-assurance environments, pin each action to a reviewed full commit SHA and enforce it with organization policy. Do not broaden the allowed shell command list without a review of what an agent could exfiltrate or mutate.
