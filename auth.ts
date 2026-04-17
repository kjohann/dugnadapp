import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { hasRequiredAuthEnv, isTestAuthAvailable } from "@/lib/auth-env";
import { isValidTestAuthEmail, normalizeTestAuthEmail } from "@/lib/test-auth";

const providers = [
  ...(hasRequiredAuthEnv()
    ? [
        Google({
          authorization: {
            params: {
              scope: "openid email",
            },
          },
        }),
      ]
    : []),
  ...(isTestAuthAvailable()
    ? [
        Credentials({
          credentials: {
            email: { label: "E-post", type: "email" },
          },
          authorize(credentials) {
            if (!isValidTestAuthEmail(credentials.email)) {
              return null;
            }

            const email = normalizeTestAuthEmail(credentials.email);

            return {
              email,
              id: email,
              image: null,
              name: null,
            };
          },
        }),
      ]
    : []),
];

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
    async jwt({ token, user }) {
      if (typeof user?.email === "string") {
        token.email = user.email;
      }

      return token;
    },
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
