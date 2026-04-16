import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

type Command = "migrate-dev" | "migrate-deploy" | "seed" | "studio";

const envPath = path.join(process.cwd(), ".env");
const prismaCommand = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "prisma.cmd" : "prisma",
);

function parseEnvFile() {
  if (!existsSync(envPath)) {
    throw new Error("Missing .env for this worktree. Run `npm run agent:init` first.");
  }

  const entries = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");

      if (separatorIndex === -1) {
        return null;
      }

      const key = line.slice(0, separatorIndex).trim();
      const rawValue = line.slice(separatorIndex + 1).trim();
      const value =
        rawValue.startsWith("\"") && rawValue.endsWith("\"")
          ? rawValue.slice(1, -1)
          : rawValue;

      return [key, value] as const;
    })
    .filter((entry): entry is readonly [string, string] => entry !== null);

  return Object.fromEntries(entries);
}

function getDatabaseName(databaseUrl: string) {
  return new URL(databaseUrl).pathname.replace(/^\//, "");
}

function validateAgentEnvironment(command: Command, env: Record<string, string>) {
  if (!env.AGENT_ID) {
    throw new Error("AGENT_ID is missing from .env. Run `npm run agent:init` first.");
  }

  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from .env.");
  }

  if (!env.SHADOW_DATABASE_URL) {
    throw new Error("SHADOW_DATABASE_URL is missing from .env.");
  }

  const databaseName = getDatabaseName(env.DATABASE_URL);
  const shadowDatabaseName = getDatabaseName(env.SHADOW_DATABASE_URL);

  if (databaseName === shadowDatabaseName) {
    throw new Error("DATABASE_URL and SHADOW_DATABASE_URL must point to different databases.");
  }

  if (databaseName === "dugnadapp" || databaseName === "postgres") {
    throw new Error(
      `Refusing to run Prisma against shared database "${databaseName}". Run \`npm run agent:init\` first.`,
    );
  }

  if (shadowDatabaseName === "dugnadapp" || shadowDatabaseName === "postgres") {
    throw new Error(
      `Refusing to run Prisma against shared shadow database "${shadowDatabaseName}". Run \`npm run agent:init\` first.`,
    );
  }

  if (command === "seed" && databaseName.includes("shadow")) {
    throw new Error(`Refusing to seed shadow database "${databaseName}".`);
  }
}

function runPrisma(args: string[]) {
  const result = spawnSync(prismaCommand, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const command = process.argv[2] as Command | undefined;

if (!command) {
  throw new Error("A Prisma command is required.");
}

const env = parseEnvFile();
validateAgentEnvironment(command, env);

switch (command) {
  case "migrate-dev":
    runPrisma(["migrate", "dev"]);
    break;
  case "migrate-deploy":
    runPrisma(["migrate", "deploy"]);
    break;
  case "seed":
    runPrisma(["db", "seed"]);
    break;
  case "studio":
    runPrisma(["studio"]);
    break;
  default:
    throw new Error(`Unsupported Prisma command: ${String(command)}`);
}
