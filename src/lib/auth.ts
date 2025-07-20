import { PrismaClient } from "@/generated/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const prisma = new PrismaClient();

import Credentials from "next-auth/providers/credentials";

//

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any | null> {
        console.log("🔐 Authorize called with:", { email: credentials?.email });

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("❌ User not found");
            return null;
          }

          if (!user.hashedPassword) {
            console.log("❌ User has no password (OAuth user)");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );

          if (!isPasswordValid) {
            console.log("❌ Invalid password");
            return null;
          }

          console.log("✅ User authenticated successfully");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("❌ Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
});
