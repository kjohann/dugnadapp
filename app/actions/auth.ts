"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { assertGoogleAuthConfigured, isTestAuthAvailable } from "@/lib/auth-env";
import {
  isValidTestAuthEmail,
  missingPreparedTestAuthError,
  normalizeTestAuthEmail,
  preparedTestAuthCookie,
} from "@/lib/test-auth";

export async function signInFromHomePage() {
  if (isTestAuthAvailable()) {
    const cookieStore = await cookies();
    const preparedEmail = cookieStore.get(preparedTestAuthCookie.name)?.value;

    cookieStore.set(preparedTestAuthCookie.name, "", {
      ...preparedTestAuthCookie.options,
      maxAge: 0,
    });

    if (!isValidTestAuthEmail(preparedEmail)) {
      redirect(`/?authError=${missingPreparedTestAuthError}`);
    }

    await signIn("credentials", {
      email: normalizeTestAuthEmail(preparedEmail),
      redirectTo: "/profile",
    });

    return;
  }

  assertGoogleAuthConfigured();
  await signIn("google", { redirectTo: "/profile" });
}
