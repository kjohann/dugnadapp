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
