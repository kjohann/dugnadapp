const requiredGoogleAuthEnvKeys = [
  "AUTH_SECRET",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
] as const;

type AuthEnvKey = (typeof requiredGoogleAuthEnvKeys)[number];

function hasConfiguredTestAuthSecret() {
  const secret = process.env.AUTH_TEST_MODE_SECRET;
  return typeof secret === "string" && secret.trim().length > 0;
}

export function getMissingAuthEnvKeys(): AuthEnvKey[] {
  return requiredGoogleAuthEnvKeys.filter((key) => {
    const value = process.env[key];
    return typeof value !== "string" || value.trim().length === 0;
  });
}

export function hasRequiredAuthEnv() {
  return getMissingAuthEnvKeys().length === 0;
}

export function isTestAuthExplicitlyEnabled() {
  return process.env.AUTH_ENABLE_TEST_MODE === "true";
}

export function isTestAuthAvailable() {
  return (
    process.env.NODE_ENV !== "production" &&
    isTestAuthExplicitlyEnabled() &&
    hasConfiguredTestAuthSecret()
  );
}

export function hasConfiguredAuthProvider() {
  return hasRequiredAuthEnv() || isTestAuthAvailable();
}

export function getAuthSetupHint() {
  if (hasRequiredAuthEnv() || isTestAuthAvailable()) {
    return null;
  }

  if (isTestAuthExplicitlyEnabled()) {
    if (process.env.NODE_ENV === "production") {
      return "Test-innlogging kan ikke brukes i produksjon. Google-innlogging må fortsatt være konfigurert.";
    }

    return "Test-innlogging krever `AUTH_ENABLE_TEST_MODE=true` og `AUTH_TEST_MODE_SECRET` i worktreeets lokale .env-fil.";
  }

  const missing = getMissingAuthEnvKeys();

  if (missing.length === 0) {
    return null;
  }

  return `Mangler ${missing.join(", ")}. Kjør \`npm run agent:init -- --seed\` for worktreeet, og legg deretter til Google-variablene i den lokale .env-filen.`;
}

export function assertGoogleAuthConfigured() {
  const missing = getMissingAuthEnvKeys();

  if (missing.length === 0) {
    return;
  }

  throw new Error(
    `Google-innlogging krever ${missing.join(", ")} i worktreeets lokale .env-fil. Kjør \`npm run agent:init -- --seed\` og legg deretter til variablene for dette worktreeet.`,
  );
}
