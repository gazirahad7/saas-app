import { PrismaClient } from "@/generated/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const prisma = new PrismaClient();

import { saltAndHashPassword } from "@/lib/utils/password";
import Credentials from "next-auth/providers/credentials";

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
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /*
      authorize: async (credentials) => {
        if (!credentials || !credentials?.email || !credentials?.password) {
          //throw new Error("Email and password are required");

          return null;
        }

        const email = credentials.email as string;
        const hash = saltAndHashPassword(credentials?.password as string);

        console.log("Email:", email);
        console.log("Hashed Password:", hash);

        let user: any = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              hashedPassword: hash,
              role: "USER",
            },
          });
        } else {
          const isMatch = bcrypt.compareSync(
            credentials.password as string,
            user.hashedPassword as string
          );

          if (!isMatch) {
            throw new Error("Invalid email or password");
          }
        }

        return user;
      },
*/
      // update code

      authorize: async (credentials) => {
        const { email, password } = credentials ?? {};
        if (!email || !password) throw new Error("Missing credentials");

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid email or password");
        }

        const isValid = bcrypt.compareSync(password, user.hashedPassword);
        if (!isValid) throw new Error("Invalid email or password");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
