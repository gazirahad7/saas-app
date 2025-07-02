"use client";

import { logout } from "@/actions/auth";
import React from "react";

function Logout() {
  return (
    <div onClick={() => logout()}>
      <button
        type="button"
        className="btn h-10 px-4 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
