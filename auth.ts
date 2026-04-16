import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { hasRequiredAuthEnv } from "@/lib/auth-env";

const providers = hasRequiredAuthEnv()
  ? [
      Google({
        authorization: {
          params: {
            scope: "openid email",
          },
        },
      }),
    ]
  : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? "missing-auth-secret",
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          email: typeof token.email === "string" ? token.email : null,
          name: null,
          image: null,
        },
      };
    },
  },
});
