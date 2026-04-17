import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

function readEnvValue(key: string) {
  const envPath = path.join(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return null;
  }

  const match = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((line) => line.startsWith(`${key}=`));

  if (!match) {
    return null;
  }

  const rawValue = match.slice(key.length + 1).trim();

  if (rawValue.startsWith("\"") && rawValue.endsWith("\"")) {
    return rawValue.slice(1, -1);
  }

  return rawValue || null;
}

process.env.AUTH_TEST_MODE_SECRET ??= readEnvValue("AUTH_TEST_MODE_SECRET") ?? undefined;
process.env.PORT ??= readEnvValue("PORT") ?? undefined;

const port = process.env.PORT ?? "3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run agent:dev",
    reuseExistingServer: true,
    timeout: 120_000,
    url: baseURL,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
