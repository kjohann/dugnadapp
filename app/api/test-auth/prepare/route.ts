import { NextResponse } from "next/server";

import { isTestAuthAvailable, isTestAuthExplicitlyEnabled } from "@/lib/auth-env";
import {
  getExpectedTestAuthSecret,
  isValidTestAuthEmail,
  normalizeTestAuthEmail,
  preparedTestAuthCookie,
} from "@/lib/test-auth";

type PrepareBody = {
  email?: unknown;
  secret?: unknown;
};

function isPrepareBody(value: unknown): value is PrepareBody {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error: "Test-innlogging er ikke tilgjengelig i produksjon.",
      },
      { status: 403 },
    );
  }

  if (!isTestAuthExplicitlyEnabled()) {
    return NextResponse.json(
      {
        error: "Test-innlogging er ikke aktivert for dette worktreeet.",
      },
      { status: 403 },
    );
  }

  if (!isTestAuthAvailable()) {
    return NextResponse.json(
      {
        error: "Test-innlogging krever `AUTH_ENABLE_TEST_MODE=true` og `AUTH_TEST_MODE_SECRET` i worktreeets lokale .env-fil.",
      },
      { status: 403 },
    );
  }

  const payload = (await request.json()) as unknown;

  if (!isPrepareBody(payload)) {
    return NextResponse.json(
      {
        error: "Ugyldig forespørsel for test-innlogging.",
      },
      { status: 400 },
    );
  }

  const expectedSecret = getExpectedTestAuthSecret();

  if (expectedSecret === null) {
    return NextResponse.json(
      {
        error: "AUTH_TEST_MODE_SECRET mangler i worktreeets lokale .env-fil.",
      },
      { status: 403 },
    );
  }

  if (payload.secret !== expectedSecret) {
    return NextResponse.json(
      {
        error: "Ugyldig hemmelighet for test-innlogging.",
      },
      { status: 401 },
    );
  }

  if (!isValidTestAuthEmail(payload.email)) {
    return NextResponse.json(
      {
        error: "Test-innlogging krever en gyldig e-postadresse.",
      },
      { status: 400 },
    );
  }

  const email = normalizeTestAuthEmail(payload.email);
  const response = NextResponse.json({ email, ok: true });

  response.cookies.set(
    preparedTestAuthCookie.name,
    email,
    preparedTestAuthCookie.options,
  );

  return response;
}
