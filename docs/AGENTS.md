# Knowledge-base rules

`docs/` is the repository's durable project memory. Use **wiki-first, raw-when-needed** retrieval:

1. Read `docs/wiki/index.md` to find the relevant concise synthesis page.
2. Read that wiki page and follow its links.
3. Open a linked artifact under `docs/raw/` only for exact requirements, original decision rationale, acceptance criteria, or conflict resolution.

`docs/raw/` contains canonical artifacts: ADRs, context, specifications, PRDs, research, plans, issue exports, and skill maps. `docs/wiki/` is the navigable synthesis layer. If they conflict, the raw artifact wins; flag the mismatch and update the wiki when safe.

For substantial new knowledge, create or update the appropriate raw artifact first, then add or update its linked wiki synthesis and the wiki index. Do not turn a wiki-only page into the sole canonical record of a significant decision or requirement.

## Layout

```txt
docs/
├── AGENTS.md
├── README.md
├── raw/
│   ├── adr/       # architecture decision records
│   ├── context/   # glossary, invariants, system context
│   ├── specs/     # canonical behavior and acceptance criteria
│   ├── prds/      # product requirements
│   ├── research/  # external research and reference material
│   ├── plans/     # accepted implementation plans
│   ├── issues/    # issue exports or drafts
│   └── skills/    # skill maps and conventions
└── wiki/
    ├── index.md
    ├── overview.md
    ├── architecture/
    ├── operations/
    ├── features/
    ├── product/
    ├── sources/
    └── log/entries/
```

Avoid appending feature notes directly to a shared log file. Add one small dated fragment under `docs/wiki/log/entries/` when a change creates durable operational knowledge.
