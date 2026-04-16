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

2. Start Postgres:

   ```powershell
   npm run db:up
   ```

3. Run the first migration:

   ```powershell
   npm run db:migrate -- --name init
   ```

4. Seed the starter community and tasks:

   ```powershell
   npm run db:seed
   ```

5. Start the app:

   ```powershell
   npm run dev
   ```

Then open [http://localhost:3000](http://localhost:3000).

## Useful commands

```powershell
npm run lint
npm run build
npm run db:logs
npm run db:studio
npm run db:down
```

## Environment

Copy `.env.example` to `.env` if you need to recreate the local environment file manually. The default local database URL targets the Docker Compose Postgres service on port `5432`.

## Next iteration ideas

- Add authentication and community membership
- Add CRUD for tasks and work sessions
- Add assignment, status updates, and due dates
