import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string       // ← ADD THIS
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string         // ← ADD THIS
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string         // ← ADD THIS
    role: string
  }
}