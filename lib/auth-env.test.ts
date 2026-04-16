import assert from "node:assert/strict";
import test from "node:test";

import {
  canUseTestLogin,
  getMissingAuthEnvKeys,
  getTestLoginEmail,
  getTestLoginName,
} from "@/lib/auth-env";

function withEnv(values: Record<string, string | undefined>, callback: () => void) {
  const previous = new Map<string, string | undefined>();

  for (const [key, value] of Object.entries(values)) {
    previous.set(key, process.env[key]);

    if (typeof value === "string") {
      process.env[key] = value;
    } else {
      delete process.env[key];
    }
  }

  try {
    callback();
  } finally {
    for (const [key, value] of previous.entries()) {
      if (typeof value === "string") {
        process.env[key] = value;
      } else {
        delete process.env[key];
      }
    }
  }
}

test("canUseTestLogin only enables outside production with a secret", () => {
  withEnv(
    {
      NODE_ENV: "development",
      AUTH_TEST_LOGIN_SECRET: "dev-secret",
    },
    () => {
      assert.equal(canUseTestLogin(), true);
    },
  );

  withEnv(
    {
      NODE_ENV: "production",
      AUTH_TEST_LOGIN_SECRET: "prod-secret",
    },
    () => {
      assert.equal(canUseTestLogin(), false);
    },
  );
});

test("test login defaults stay stable when optional env is missing", () => {
  withEnv(
    {
      AUTH_TEST_LOGIN_EMAIL: undefined,
      AUTH_TEST_LOGIN_NAME: undefined,
    },
    () => {
      assert.equal(getTestLoginEmail(), "test-organizer@dugnadapp.local");
      assert.equal(getTestLoginName(), "Testarrangør");
    },
  );
});

test("google auth env checks are unchanged", () => {
  withEnv(
    {
      AUTH_SECRET: undefined,
      AUTH_GOOGLE_ID: undefined,
      AUTH_GOOGLE_SECRET: undefined,
    },
    () => {
      assert.deepEqual(getMissingAuthEnvKeys(), [
        "AUTH_SECRET",
        "AUTH_GOOGLE_ID",
        "AUTH_GOOGLE_SECRET",
      ]);
    },
  );
});
