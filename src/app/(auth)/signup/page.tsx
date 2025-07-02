import React from "react";
import { SignupForm } from "@/components/SignupForm";

function page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignupForm className="w-full max-w-xs m-auto" />
    </div>
  );
}

export default page;
