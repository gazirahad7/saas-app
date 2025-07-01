"use client";
import { useFormStatus } from "react-dom";
import React from "react";

function AuthButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`
        ${pending ? "bg-gray-500 text-white" : "bg-blue-500 text-white"}

        w-full 
        
    `}
    >
      {pending ? "Processing..." : "Login"}
    </button>
  );
}

export default AuthButton;
