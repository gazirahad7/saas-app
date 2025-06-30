// app/api/users/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
// import { prisma } from "@/lib/prisma";
//import { PrismaClient } from "@prisma/client";

import { PrismaClient } from "../../../../src/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // const connection = await db();
    //const [rows] = await connection.query("SELECT * FROM users");
    //  return NextResponse.json({ users: rows });

    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "ladlfk" },
      { status: 500 }
    );
  }
}
