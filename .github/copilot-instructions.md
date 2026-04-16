# Repository overview

- Dugnadapp is a Next.js 16 App Router starter for a community work manager.
- The stack is TypeScript, Prisma, Postgres, and Tailwind via the Next.js app in `app\`, Prisma schema and migrations in `prisma\`, and helper scripts in `scripts\`.
- The app is intentionally small right now, so process and workflow instructions matter as much as source structure.

# Local workflow

- Prefer the repo-local runtime from `mise.toml`.
- The standard local setup is:
  1. `mise install`
  2. `npm run db:up`
  3. `npm run agent:init -- --seed`
  4. `npm run agent:dev`
- Use the isolated `agent:*` scripts instead of hand-editing `.env` or pointing Prisma at shared databases.

# Validation

- Validate repository changes with `npm run lint` and `npm run build`.
- If a task changes database behavior, use the existing Prisma scripts from `package.json` after `npm run agent:init`.

# PRD to implementation workflow

- Treat a GitHub issue as the durable handoff between the PRD session and the implementation session.
- PRD issues should follow `.github/ISSUE_TEMPLATE/prd.yml` so a later session can implement from the issue number alone.
- Both the PRD stage and the implementation stage require a rubberduck review before finishing. Use the experimental rubberduck feature when available; otherwise produce an explicit `## Rubberduck review` section.
- When a user asks to implement an issue by number, read the issue first, restate the acceptance criteria, and stop to refine the issue if the handoff is incomplete.
- If the current client cannot read the referenced issue, stop and ask for the issue body or require a GitHub-aware client. Do not replace the issue handoff with informal extra scope.

# Agent-specific files

- `AGENTS.md` defines the shared workflow contract for AI agents.
- `.github/agents/prd-author.agent.md` is the PRD-focused agent.
- `.github/agents/issue-implementer.agent.md` is the implementation-focused agent.
- `.github/prompts/*.prompt.md` provide slash-command aliases for IDEs that support prompt files.
- This repository intentionally uses instructions, custom agents, prompt files, and issue templates. It does not depend on custom skills or extensions for this workflow.
