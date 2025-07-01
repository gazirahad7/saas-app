"use server";

import { PrismaClient } from "@/generated/prisma";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();
export const login = async (provider: string) => {
  await signIn(provider, {
    redirectTo: "/dashboard",
  });

  revalidatePath("/");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

export const loginWithCredentials = async (formData: FormData) => {
  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: "USER" as const,
    redirectTo: "/dashboard",
  };

  const existingUser = await getUserByEmail(rawFormData.email);

  console.log("Existing User:", existingUser);

  try {
    await signIn("credentials", rawFormData);
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid email or password. Please try again.",
          };

        default:
          return {
            error: "An unexpected error occurred. Please try again later.",
          };
      }
    }

    throw error;
  }
  revalidatePath("/");
};
