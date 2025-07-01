import { auth } from "@/lib/auth";
import React from "react";

async function service() {
  const session = await auth();
  return (
    <div>
      <h1>Middleware page</h1>

      <p>{session?.user?.email}</p>
    </div>
  );
}

export default service;
