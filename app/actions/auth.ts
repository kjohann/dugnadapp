"use server";

import { signIn } from "@/auth";
import { assertAuthConfigured } from "@/lib/auth-env";

export async function signInWithGoogle() {
  assertAuthConfigured();
  await signIn("google", { redirectTo: "/profile" });
}
