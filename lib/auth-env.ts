const requiredAuthEnvKeys = [
  "AUTH_SECRET",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
] as const;

type AuthEnvKey = (typeof requiredAuthEnvKeys)[number];

export function getMissingAuthEnvKeys(): AuthEnvKey[] {
  return requiredAuthEnvKeys.filter((key) => {
    const value = process.env[key];
    return typeof value !== "string" || value.trim().length === 0;
  });
}

export function hasRequiredAuthEnv() {
  return getMissingAuthEnvKeys().length === 0;
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
