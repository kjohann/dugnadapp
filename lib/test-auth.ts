const testAuthEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const preparedTestAuthCookie = {
  name: "dugnadapp-test-auth-email",
  options: {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  },
};

export const missingPreparedTestAuthError = "missing-prepared-test-auth-email";

export function getExpectedTestAuthSecret() {
  const secret = process.env.AUTH_TEST_MODE_SECRET;

  if (typeof secret !== "string") {
    return null;
  }

  const trimmedSecret = secret.trim();
  return trimmedSecret.length > 0 ? trimmedSecret : null;
}

export function normalizeTestAuthEmail(value: unknown) {
  return String(value).trim().toLowerCase();
}

export function isValidTestAuthEmail(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return testAuthEmailPattern.test(normalizeTestAuthEmail(value));
}

export function getTestAuthErrorMessage(value: string | null | undefined) {
  if (value === missingPreparedTestAuthError) {
    return "Test-innlogging krever at du forbereder neste e-post via /api/test-auth/prepare før du bruker innloggingsknappen.";
  }

  return null;
}
