"use client";

import { logout } from "@/actions/auth";
import React from "react";

function Logout() {
  return (
    <div onClick={() => logout()}>
      <button type="button">Logout</button>
    </div>
  );
}

export default Logout;
