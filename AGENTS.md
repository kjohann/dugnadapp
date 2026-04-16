<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Dugnadapp agent workflow

## App UI language
The App's UI should be in Norwegian, but use english in code. Update the list below as needed with domain terms.

### Domain terms

- Dugnad: Community work effort: what this entire app is about.
- Oppgave: Task

## Shared contract

- The canonical workflow is: PRD authoring -> GitHub issue handoff -> implementation by issue number -> rubberduck review -> completion.
- The GitHub issue is the durable handoff artifact between sessions. A fresh implementation session must be able to succeed from the issue number alone.
- Do not rely on hidden memory from an earlier chat when implementing an issue.
- Use `.github/copilot-instructions.md` for repository-wide context and `.github/agents/*.agent.md` for the role-specific workflows.

## PRD issue contract

- PRDs should be created from `.github/ISSUE_TEMPLATE/prd.yml`.
- Every PRD issue must include: summary, problem, goals, non-goals, target users, user stories, UX and behavior, acceptance criteria, data or backend impact, rollout and observability notes, dependencies, open questions, and a rubberduck review section.
- If any area is unknown, record it explicitly as an open question instead of leaving a gap.
- The PRD author should create or update the GitHub issue directly as the default outcome. In local CLI sessions, treat authenticated `gh` access as sufficient GitHub access even when dedicated GitHub tools are not exposed.
- The PRD author should make the intended GitHub action explicit before any approval checkpoint: say whether it plans to create a new issue or update an existing one, and say that it will do so with GitHub tools or `gh`.
- Only fall back to a ready-to-paste title and body after verifying that GitHub issue tools are unavailable and `gh` is unavailable or unauthenticated.

## Rubberduck review contract

- Both the PRD author and the implementation agent must use the experimental rubberduck feature when it is available in the current client.
- If the feature is unavailable, do not skip the review. Add an explicit `## Rubberduck review` section instead.
- The review must challenge assumptions, call out contradictory or missing requirements, identify the highest-risk failure modes, note what changed because of the review, and list any remaining risks or open questions.
- Do not consider work finished until the rubberduck review exists.

## Named workflow entry points

- Shared instructions apply in every supported client.
- The named agents for IDE workflows live in `.github/agents/prd-author.agent.md` and `.github/agents/issue-implementer.agent.md`.
- The prompt aliases for IDE workflows live in `.github/prompts/create-prd.prompt.md` and `.github/prompts/implement-issue.prompt.md`.

## Implementation handoff rules

- The implementation agent starts by reading the referenced issue and restating the acceptance criteria before coding.
- The issue-number-only workflow assumes the current client can resolve a GitHub issue number or URL into the issue body. In local CLI sessions, use `gh issue view` before concluding that GitHub access is unavailable. If the issue still cannot be fetched, stop and request the issue body or switch to a GitHub-aware client instead of accepting off-template scope.
- If the issue is not implementation-ready, refine the issue first instead of guessing at missing scope.
- Local coding sessions should use the worktree bootstrap flow from `README.md`: `npm run agent:init -- --seed` before database work and `npm run agent:dev` when an app process is needed.
- The implementation agent should prefer TDD when practical: add or update failing tests first, or reproduce the acceptance criteria with the Playwright MCP server before changing code.
- Before creating or updating a PR, the implementation branch must be rebased onto the latest `main`, and the final verification must happen after that rebase.
- Final verification should run all relevant existing tests and, at minimum, `npm run lint` and `npm run build`. When no automated coverage exists for a critical UI flow, use the Playwright MCP server to verify it explicitly and note the gap.
