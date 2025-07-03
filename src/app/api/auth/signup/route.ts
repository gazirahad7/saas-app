// /app/api/auth/signup/route.ts

import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { saltAndHashPassword } from "@/lib/utils/password";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("Email:", email);

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashed = saltAndHashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword: hashed,
        role: "USER",
      },
    });

    return NextResponse.json({
      success: true,
      user: { email: user.email, id: user.id },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
