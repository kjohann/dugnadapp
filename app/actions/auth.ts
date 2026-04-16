"use server";

import { signIn } from "@/auth";
import {
  assertAuthConfigured,
  assertTestLoginConfigured,
  getTestLoginSecret,
} from "@/lib/auth-env";

export async function signInWithGoogle() {
  assertAuthConfigured();
  await signIn("google", { redirectTo: "/profile" });
}

export async function signInWithTestUser() {
  assertTestLoginConfigured();
  await signIn("test-user", {
    testLoginSecret: getTestLoginSecret(),
    redirectTo: "/profile",
  });
}
