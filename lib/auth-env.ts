const requiredGoogleAuthEnvKeys = [
  "AUTH_SECRET",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
] as const;

type AuthEnvKey = (typeof requiredGoogleAuthEnvKeys)[number];

const defaultTestLoginEmail = "test-organizer@dugnadapp.local";
const defaultTestLoginName = "Testarrangør";

function hasValue(key: string) {
  const value = process.env[key];
  return typeof value === "string" && value.trim().length > 0;
}

export function getMissingAuthEnvKeys(): AuthEnvKey[] {
  return requiredGoogleAuthEnvKeys.filter((key) => !hasValue(key));
}

export function hasRequiredAuthEnv() {
  return getMissingAuthEnvKeys().length === 0;
}

export function canUseTestLogin() {
  return process.env.NODE_ENV !== "production" && hasValue("AUTH_TEST_LOGIN_SECRET");
}

export function getTestLoginSecret() {
  return process.env.AUTH_TEST_LOGIN_SECRET?.trim() ?? "";
}

export function getTestLoginEmail() {
  return process.env.AUTH_TEST_LOGIN_EMAIL?.trim() || defaultTestLoginEmail;
}

export function getTestLoginName() {
  return process.env.AUTH_TEST_LOGIN_NAME?.trim() || defaultTestLoginName;
}

export function getAuthSetupHint() {
  const missing = getMissingAuthEnvKeys();

  if (missing.length === 0) {
    return null;
  }

  return `Mangler ${missing.join(", ")}. Kjør \`npm run agent:init -- --seed\` for worktreeet, og legg deretter variablene til i den lokale .env-filen.`;
}

export function assertAuthConfigured() {
  const missing = getMissingAuthEnvKeys();

  if (missing.length === 0) {
    return;
  }

  throw new Error(
    `Google-innlogging krever ${missing.join(", ")} i worktreeets lokale .env-fil. Kjør \`npm run agent:init -- --seed\` og legg deretter til variablene for dette worktreeet.`,
  );
}

export function assertTestLoginConfigured() {
  if (canUseTestLogin()) {
    return;
  }

  throw new Error(
    "Testinnlogging krever AUTH_TEST_LOGIN_SECRET i worktreeets lokale .env-fil og er bare tilgjengelig utenfor production.",
  );
}
