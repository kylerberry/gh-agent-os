#!/usr/bin/env node

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");

const issueNumber = Number(process.env.ISSUE_NUMBER || "");
const repository =
  process.env.REPOSITORY || process.env.GITHUB_REPOSITORY || "";
const eventName = process.env.EVENT_NAME || "";
const triggeringActor = process.env.TRIGGERING_ACTOR || "";

if (!issueNumber) {
  throw new Error("ISSUE_NUMBER is required.");
}

if (!repository) {
  throw new Error("REPOSITORY or GITHUB_REPOSITORY is required.");
}

const ghJson = (args) => {
  const output = execFileSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
};

const truncate = (value, maxChars, label) => {
  const text = value || "";
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n_${label} truncated to ${maxChars} characters by workflow. Inspect GitHub issue directly if omitted context is required._`;
};

const issue = ghJson(["api", `repos/${repository}/issues/${issueNumber}`]);
const comments = ghJson([
  "api",
  `repos/${repository}/issues/${issueNumber}/comments`,
  "--method",
  "GET",
  "-f",
  "per_page=100",
]);
const marker = "<!-- agent:research-spec -->";

const researchComment = [...comments]
  .reverse()
  .find((comment) => comment.body?.includes(marker));

const visibleCommentsText = comments
  .filter((comment) => !comment.body?.includes(marker))
  .map((comment) =>
    [
      `### Comment by ${comment.user?.login || "unknown"} at ${comment.created_at}`,
      "",
      comment.body || "",
    ].join("\n"),
  )
  .join("\n\n---\n\n");

const rolePrompt = fs.readFileSync(
  "scripts/agents/prompts/implement.md",
  "utf8",
);
const labels =
  (issue.labels || [])
    .map((label) => (typeof label === "string" ? label : label.name))
    .filter(Boolean)
    .join(", ") || "None";

const prompt = [
  rolePrompt,
  "",
  "## Workflow context",
  "",
  `Repository: ${repository}`,
  `Issue number: ${issueNumber}`,
  `GitHub event: ${eventName}`,
  `Triggering actor: ${triggeringActor}`,
  `Implementation branch convention: agent/issue-${issueNumber}-<short-slug>`,
  "",
  "## Issue context",
  "",
  `Title: ${issue.title}`,
  `Labels: ${labels}`,
  "",
  "### Issue body",
  "",
  issue.body
    ? truncate(issue.body, 8000, "Issue body")
    : "_No issue body provided._",
  "",
  "### Agent Research Spec",
  "",
  researchComment?.body
    ? truncate(researchComment.body, 5000, "Agent Research Spec")
    : "_No agent research spec comment was found. If the issue is ambiguous without research, stop and explain the blocker._",
  "",
  "### Other issue comments",
  "",
  visibleCommentsText
    ? truncate(visibleCommentsText, 4000, "Other issue comments")
    : "_No additional comments._",
  "",
  "## Implementation instruction",
  "",
  "Implement this issue now. Create focused repository changes and commit them on the agent branch created by the workflow. Do not open a pull request, merge, change labels, or mutate GitHub Project status in this slice.",
].join("\n");

process.stdout.write(prompt);
