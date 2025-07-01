"use server";

import Logout from "@/components/Logout";
import { auth } from "@/lib/auth";
import { redirect } from "next/dist/server/api-utils";
import { signOut } from "next-auth/react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <p>You must be signed in.</p>;
  }

  return (
    <div>
      <h1>Hello {session.user.email}</h1>
      <p>Role: {session.user.role}</p>

      <Logout />

      {/* <button onClick={() => signOut()}>Sign Out</button> */}
    </div>
  );
}
