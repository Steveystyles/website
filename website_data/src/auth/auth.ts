import { readSecret } from "@/lib/secrets"
import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// 🔐 Sanity check — fail fast if NEXTAUTH_SECRET is missing
if (!process.env.NEXT_RUNTIME || process.env.NEXT_RUNTIME === "nodejs") {
  try {
    readSecret("NEXTAUTH_SECRET")
  } catch (err) {
    console.error("❌ NEXTAUTH_SECRET is missing or unreadable")
    throw err
  }
}

export const authOptions: NextAuthOptions = {
  secret: readSecret("NEXTAUTH_SECRET"),
  pages: {
    signIn: "/login",
    error: "/login/error",
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ✅ Proper TypeScript narrowing
        if (!credentials?.email || !credentials?.password) {
          return null
        }

      const email = credentials.email.trim()

      const user = await prisma.user.findFirst({
        where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    })

  if (!user || !user.passwordHash) {
    return null
  }

  const isValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  )

  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "USER" | "ADMIN"
      }
      return session
    },
  },
}
