import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import {
  canUseTestLogin,
  getTestLoginEmail,
  getTestLoginName,
  getTestLoginSecret,
  hasRequiredAuthEnv,
} from "@/lib/auth-env";

const providers = [];

if (hasRequiredAuthEnv()) {
  providers.push(
    Google({
      authorization: {
        params: {
          scope: "openid email",
        },
      },
    }),
  );
}

if (canUseTestLogin()) {
  providers.push(
    Credentials({
      id: "test-user",
      name: "Test user",
      credentials: {
        testLoginSecret: { label: "Test login secret", type: "password" },
      },
      async authorize(credentials) {
        const submittedSecret =
          typeof credentials?.testLoginSecret === "string"
            ? credentials.testLoginSecret
            : "";
        const expectedSecret = getTestLoginSecret();

        if (!expectedSecret || submittedSecret !== expectedSecret) {
          return null;
        }

        return {
          id: "test-user",
          email: getTestLoginEmail(),
          name: getTestLoginName(),
        };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? "missing-auth-secret",
  trustHost: process.env.NODE_ENV !== "production",
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

      if (typeof user?.name === "string") {
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          email: typeof token.email === "string" ? token.email : null,
          name: typeof token.name === "string" ? token.name : null,
          image: null,
        },
      };
    },
  },
});
