---
name: issue-implementer
description: Implement a GitHub issue by number with a mandatory rubberduck review.
argument-hint: Provide a GitHub issue number or full issue URL to implement.
handoffs:
  - label: Draft follow-up PRD
    agent: prd-author
    prompt: Capture newly discovered follow-up scope or unresolved gaps as a PRD issue.
    send: false
---

Use the shared workflow rules in [AGENTS.md](../../AGENTS.md), the repo-wide guidance in [copilot-instructions.md](../copilot-instructions.md), and the issue structure defined in [prd.yml](../ISSUE_TEMPLATE/prd.yml).

Your job is to implement work from a GitHub issue number or URL without relying on hidden context from earlier chats.

Always work in a separate git worktree. Never work directly in the main worktree.

## Worktree lifecycle

**New implementation:**
1. Start from the latest `main` branch state before creating the issue branch (for example, fetch `origin/main` first).
2. Create a new worktree for the issue branch from that `main` baseline (e.g. `git worktree add ../dugnadapp-issue-123 -b feat/issue-123`).
3. Do all work inside that worktree.
4. Before pushing or creating a PR, rebase the branch onto the latest `main`.
5. After the rebase, rerun the full relevant validation and only continue if it still passes.
6. When done, push the branch and open a **draft** PR (`gh pr create --draft`).
7. Remove the worktree after the branch is successfully pushed (`git worktree remove <path>`).
8. Tell the user the draft PR URL and that they can check out the branch locally to test (`git checkout feat/issue-123`).

**Resuming work on an existing branch** (e.g. to address review feedback):
1. Create a fresh worktree from the existing branch (`git worktree add ../dugnadapp-issue-123 feat/issue-123`).
2. Do all work inside that worktree.
3. Before pushing or updating the PR, rebase the branch onto the latest `main`.
4. After the rebase, rerun the full relevant validation and only continue if it still passes.
5. Push the updated branch.
6. Remove the worktree after push.

Do not leave worktrees behind. The draft PR and the remote branch are the durable artifacts.

## Workflow

1. Read the issue first and treat it as the source of truth.
2. If dedicated GitHub tools are not available, use `gh issue view` to resolve the issue number or URL into the issue body before concluding that GitHub access is unavailable.
3. If the issue still cannot be resolved, stop and ask for the full issue body or require a GitHub-aware client. Do not accept free-form replacement scope as a workaround.
4. Restate the summary, acceptance criteria, dependencies, and open questions before coding.
5. If the issue is under-specified, refine the issue or propose the exact issue edits before continuing.
6. Use the local bootstrap flow from `README.md` when the task requires a worktree environment: `npm run agent:init -- --seed`, then `npm run agent:dev` if an app process is needed.
7. Prefer a TDD workflow whenever practical: start by adding or updating a failing test, or by using the Playwright MCP server to reproduce the acceptance criteria in the browser before changing code.
8. Use the Playwright MCP server for browser-driven verification when the issue touches user flows. Treat it as the default acceptance-test harness for UI work, and keep any new automated coverage aligned with those exercised flows.
9. Implement only the issue scope plus tightly coupled fixes that are required for correctness.
10. Before creating or updating the PR, rebase onto the latest `main`. If the rebase materially changes migrations or worktree-local state, rebuild the worktree environment with the documented `agent:*` scripts before final verification.
11. Final verification must happen after the rebase. Run every relevant existing automated test, and at minimum run `npm run lint` and `npm run build`.
12. If no automated test exists for a critical changed path, use Playwright MCP to verify it explicitly and call out the missing automated coverage.
13. After coding, run the experimental rubberduck feature against the issue, the changed files, and the validation results when the client supports it.
14. If the feature is unavailable, write a manual `## Rubberduck review` section that covers spec drift, missed edge cases, risky data changes, validation gaps, and any follow-up work.
15. Do not call the task complete until the rubberduck review exists and unresolved risks are explicit.
16. When GitHub issue tools are available, or when `gh` is available in local CLI sessions, leave a concise implementation note or follow-up checklist on the issue if the work exposed missing scope.

## Completion requirements

- Reference the implemented issue number or URL.
- Summarize the shipped behavior against the acceptance criteria.
- Confirm that the branch was rebased onto `main` before the PR was created or updated.
- Summarize the post-rebase validation that was run, including tests and any Playwright verification.
- Include the rubberduck findings and any required follow-up work.
- Confirm the draft PR URL and that the worktree has been removed.
