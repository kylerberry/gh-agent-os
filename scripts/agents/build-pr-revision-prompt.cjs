#!/usr/bin/env node

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");

const prNumber = Number(process.env.PR_NUMBER || "");
const commentId = Number(process.env.COMMENT_ID || "");
const repository =
  process.env.REPOSITORY || process.env.GITHUB_REPOSITORY || "";
const eventName = process.env.EVENT_NAME || "";
const triggerKind = process.env.TRIGGER_KIND || "issue_comment";
const triggeringActor = process.env.TRIGGERING_ACTOR || "";

if (!prNumber) {
  throw new Error("PR_NUMBER is required.");
}

if (!commentId) {
  throw new Error("COMMENT_ID is required.");
}

if (!repository) {
  throw new Error("REPOSITORY or GITHUB_REPOSITORY is required.");
}

const gh = (args) =>
  execFileSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

const ghJson = (args) => JSON.parse(gh(args));

const truncate = (value, maxChars, label) => {
  const text = value || "";
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n_${label} truncated to ${maxChars} characters by workflow. Inspect the PR directly if omitted context is required._`;
};

const safeBody = (value) => value || "_No body provided._";

const pr = ghJson(["api", `repos/${repository}/pulls/${prNumber}`]);

const issue = ghJson(["api", `repos/${repository}/issues/${prNumber}`]);

const triggerEndpoints = {
  issue_comment: `repos/${repository}/issues/comments/${commentId}`,
  pull_request_review: `repos/${repository}/pulls/${prNumber}/reviews/${commentId}`,
};

const triggerEndpoint = triggerEndpoints[triggerKind];
if (!triggerEndpoint) {
  throw new Error(`Unsupported TRIGGER_KIND: ${triggerKind}`);
}

const triggerComment = ghJson(["api", triggerEndpoint]);

const issueComments = ghJson([
  "api",
  `repos/${repository}/issues/${prNumber}/comments`,
  "--method",
  "GET",
  "-f",
  "per_page=100",
]);

const reviews = ghJson([
  "api",
  `repos/${repository}/pulls/${prNumber}/reviews`,
  "--method",
  "GET",
  "-f",
  "per_page=100",
]);

const reviewComments = ghJson([
  "api",
  `repos/${repository}/pulls/${prNumber}/comments`,
  "--method",
  "GET",
  "-f",
  "per_page=100",
]);

let diff = "";
try {
  diff = gh(["pr", "diff", String(prNumber), "--repo", repository]);
} catch (error) {
  diff = `_Unable to read PR diff: ${error.message}_`;
}

const linkedIssueNumbers = new Set();
const linkedIssuePattern =
  /(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)|#(\d+)/gi;
for (const source of [pr.title, pr.body]) {
  if (!source) continue;
  for (const match of source.matchAll(linkedIssuePattern)) {
    const number = Number(match[1] || match[2]);
    if (number && number !== prNumber) linkedIssueNumbers.add(number);
  }
}

const linkedIssues = [];
for (const number of [...linkedIssueNumbers].slice(0, 5)) {
  try {
    const linked = ghJson(["api", `repos/${repository}/issues/${number}`]);
    linkedIssues.push(
      [`### #${number}: ${linked.title}`, "", safeBody(linked.body)].join("\n"),
    );
  } catch (error) {
    linkedIssues.push(
      `### #${number}\n\n_Unable to read linked issue: ${error.message}_`,
    );
  }
}

const topLevelCommentsText = issueComments
  .map((comment) =>
    [
      `### Top-level PR comment by ${comment.user?.login || "unknown"} at ${comment.created_at}`,
      `Comment ID: ${comment.id}`,
      "",
      safeBody(comment.body),
    ].join("\n"),
  )
  .join("\n\n---\n\n");

const reviewsText = reviews
  .map((review) =>
    [
      `### Review by ${review.user?.login || "unknown"} at ${review.submitted_at || review.created_at}`,
      `State: ${review.state}`,
      "",
      safeBody(review.body),
    ].join("\n"),
  )
  .join("\n\n---\n\n");

const reviewCommentsText = reviewComments
  .map((comment) =>
    [
      `### Inline review comment by ${comment.user?.login || "unknown"} at ${comment.created_at}`,
      `Path: ${comment.path}`,
      `Line: ${comment.line || comment.original_line || "unknown"}`,
      `Resolved: ${comment.in_reply_to_id ? "reply" : "unknown"}`,
      "",
      safeBody(comment.body),
    ].join("\n"),
  )
  .join("\n\n---\n\n");

const rolePrompt = fs.readFileSync(
  "scripts/agents/prompts/pr-revise.md",
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
  `Pull request number: ${prNumber}`,
  `GitHub event: ${eventName}`,
  `Triggering actor: ${triggeringActor}`,
  `Trigger kind: ${triggerKind}`,
  `Trigger ID: ${commentId}`,
  `Base branch: ${pr.base?.ref || "unknown"}`,
  `Head branch: ${pr.head?.ref || "unknown"}`,
  `Head SHA at prompt build: ${pr.head?.sha || "unknown"}`,
  "",
  "## Triggering /agent fix-this feedback",
  "",
  `Author: ${triggerComment.user?.login || "unknown"}`,
  `URL: ${triggerComment.html_url || triggerComment.pull_request_url || "unknown"}`,
  "",
  truncate(safeBody(triggerComment.body), 3000, "Triggering comment"),
  "",
  "## Pull request context",
  "",
  `Title: ${pr.title}`,
  `State: ${pr.state}`,
  `Labels: ${labels}`,
  "",
  "### PR body",
  "",
  truncate(safeBody(pr.body), 5000, "PR body"),
  "",
  "### Linked issue context",
  "",
  linkedIssues.length
    ? truncate(linkedIssues.join("\n\n---\n\n"), 8000, "Linked issue context")
    : "_No linked issue detected from PR title/body._",
  "",
  "### Top-level PR comments",
  "",
  topLevelCommentsText
    ? truncate(topLevelCommentsText, 7000, "Top-level PR comments")
    : "_No top-level PR comments._",
  "",
  "### PR reviews",
  "",
  reviewsText ? truncate(reviewsText, 6000, "PR reviews") : "_No PR reviews._",
  "",
  "### Inline review comments",
  "",
  reviewCommentsText
    ? truncate(reviewCommentsText, 9000, "Inline review comments")
    : "_No inline review comments._",
  "",
  "### Current PR diff",
  "",
  truncate(diff, 14000, "PR diff"),
  "",
  "## Revision instruction",
  "",
  "Revise this existing PR branch now. Address only the material changes requested by the triggering `/agent fix-this` feedback and the related PR review context. If review feedback is ambiguous or requires human judgment, stop and return blocked structured output. Do not create a new branch, open a PR, merge, approve, change labels, or mutate GitHub Project status.",
].join("\n");

process.stdout.write(prompt);
