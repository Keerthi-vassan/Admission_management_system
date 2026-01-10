import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Type assertion to tell TypeScript these are strings
        const email = credentials.email as string;
        const password = credentials.password as string;

        // TODO: After dinner, we'll add real database logic here
        // For now, return a properly typed user object
        return {
          id: "1",
          email: email,
          name: "Test User",
          role: "STUDENT",
        };
      },
    }),
  ],
});
