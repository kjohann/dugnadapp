# Dugnadapp

Starter setup for a community work manager built with Next.js, Prisma, and Postgres.

## Stack

- Next.js 16 with the App Router
- TypeScript
- Prisma ORM
- Postgres via Docker Compose
- Node.js managed locally with `mise`

## Local setup

This repository includes `mise.toml`, so the safest way to run commands without relying on global Node/npm is to use `mise exec`.

1. Install the configured runtime:

   ```powershell
   mise install
   ```

2. Start the shared Postgres server:

   ```powershell
   npm run db:up
   ```

3. Bootstrap an isolated worktree environment:

   ```powershell
   npm run agent:init -- --seed
   ```

   This creates a worktree-local `.env`, an isolated application database, an isolated Prisma shadow database, and applies the committed migrations.

4. Start the app for this worktree:

   ```powershell
   npm run agent:dev
   ```

5. Open the worktree-local app port from `.env` (the bootstrap script picks one automatically).

## Parallel agent workflow

The default model is:

- one git worktree and branch per agent,
- one `.env` per worktree,
- one application database per worktree,
- one Prisma shadow database per worktree,
- one shared Postgres server on `localhost:5432`.

That means agents can run `prisma migrate dev`, seed data, and start local app processes without colliding on the same database.

Example:

```powershell
git worktree add ..\dugnadapp-feature-a -b feature-a
Set-Location ..\dugnadapp-feature-a
npm run agent:init -- --seed
npm run agent:dev
```

## PRD to issue to implementation workflow

This repository now includes repo-local Copilot workflow scaffolding for a two-session handoff:

- shared agent rules in `AGENTS.md`
- repository-wide Copilot instructions in `.github/copilot-instructions.md`
- named custom agents in `.github/agents/prd-author.agent.md` and `.github/agents/issue-implementer.agent.md`
- prompt aliases in `.github/prompts/create-prd.prompt.md` and `.github/prompts/implement-issue.prompt.md`
- an implementation-ready PRD issue form in `.github/ISSUE_TEMPLATE/prd.yml`

Suggested flow:

1. Open a planning chat and use `/create-prd` or the `prd-author` agent.
2. Ask it to draft or update a GitHub issue from the PRD form.
3. Review the issue and its required `Rubberduck review` section.
4. In a new coding session, use `/implement-issue` or the `issue-implementer` agent with the issue number or URL.
5. If local code changes are needed, bootstrap the worktree with `npm run agent:init -- --seed` and start the app with `npm run agent:dev`.
6. The implementation session should read the issue first, code to the acceptance criteria, and finish with its own rubberduck review.

Notes:

- This setup is repository-local and does not depend on personal Copilot configuration.
- The shared instructions work across clients that support repository instructions. The named agents and prompt aliases are primarily for IDE clients that support custom agents and prompt files.
- The issue-number-only handoff requires a client that can read GitHub issues from an issue number or URL. If the client cannot fetch the issue body, provide the full issue body or switch to a GitHub-aware client rather than adding extra unstated scope.
- The workflow intentionally uses instructions, custom agents, prompt files, and issue templates. It does not require custom skills or extensions.

## Database workflow

Use the Prisma scripts only after the worktree has been bootstrapped with `npm run agent:init`.

```powershell
npm run db:migrate
npm run db:migrate:deploy
npm run db:seed
npm run db:studio
```

- `db:migrate` runs `prisma migrate dev` against the current worktree's isolated database pair.
- `db:migrate:deploy` applies committed migrations to the current worktree database.
- `db:seed` refuses to run against the shared default database.

When a branch's migration history changes significantly after a rebase, the safest workflow is to destroy and recreate that worktree environment:

```powershell
npm run agent:destroy
npm run agent:init -- --seed
```

## Useful commands

```powershell
npm run lint
npm run build
npm run agent:info
npm run agent:destroy
npm run db:logs
npm run db:studio
npm run db:down
```

## Environment

`npm run agent:init` is the preferred way to create `.env`. If you need to recreate it manually, use `.env.example` as the template and make sure `DATABASE_URL` and `SHADOW_DATABASE_URL` point to different databases.

## Next iteration ideas

- Add authentication and community membership
- Add CRUD for tasks and work sessions
- Add assignment, status updates, and due dates
