"use server";

import Logout from "@/components/Logout";
import { auth } from "@/lib/auth";
import { redirect } from "next/dist/server/api-utils";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <p>You must be signed in.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1>Hello {session.user.email}</h1>
      <p>Session User Name: {session.user.name}</p>
      <p>Session Expires: {session.expires}</p>

      <Image
        src={session.user.image || "/placeholder.png"}
        alt="User Avatar"
        width={50}
        height={50}
        className="rounded-full"
      />

      <Logout />

      {/* <button onClick={() => signOut()}>Sign Out</button> */}
    </div>
  );
}
