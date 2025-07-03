"use client";

import { login, saveUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UserValidations } from "@/lib/utils/Uservalidations";
import Link from "next/link";
import { use, useActionState, useState, useEffect } from "react";
import SignupButton from "./SignupButton";

import { formatErrorMessages } from "@/lib/utils/errors";
import { error } from "console";
import { redirect } from "next/navigation";

import React from "react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [state, formAction] = useActionState(saveUser, {
    error: false,
    success: false,
  });

  //

  useEffect(() => {
    if (state.error) {
      if (typeof state.errorDetails === "string") {
        setErrorMessage(state.errorDetails);
      } else {
        setErrorMessage(formatErrorMessages(state.errorDetails));
      }
      setErrorMessage(formatErrorMessages(state.errorDetails));
    } else if (state.success) {
      console.log("User saved successfully");
      // setErrorMessage(null);
      // Redirect to dashboard or another page

      setTimeout(() => {
        redirect("/dashboard");
      }, 1000); // Redirect after 1 second
    }
  }, [state]);

  //
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fields = Object.fromEntries(formData.entries());

    const validation = UserValidations.safeParse(fields);
    if (!validation.success) {
      //console.error("Validation failed:", validation.error);
      //return;

      setErrorMessage(
        formatErrorMessages(validation.error.flatten().fieldErrors)
      );
    } else {
      React.startTransition(() => {
        formAction({ formData });
      });
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign UP</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Create an account to access all features.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            name="email"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" name="password" required />
        </div>

        {/* {errorMessage && (
          <span className="text-red-500 text-sm">{errorMessage}</span>
        )} */}

        {state.success ? (
          <span className="text-green-500 text-sm">
            Signup successful! Redirecting...
          </span>
        ) : (
          errorMessage && (
            <span className="text-red-500 text-sm">{errorMessage}</span>
          )
        )}

        <SignupButton />
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          onClick={() => login("google")}
          variant="outline"
          className="w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        You have an account?{" "}
        <Link href="login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
