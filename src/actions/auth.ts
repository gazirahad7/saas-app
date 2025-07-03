"use server";

import { PrismaClient } from "@/generated/prisma";
import { signIn, signOut } from "@/lib/auth";
import { UserValidations } from "@/lib/utils/Uservalidations";
import { error } from "console";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

import { saltAndHashPassword } from "@/lib/utils/password";
import { PrismaAdapter } from "@auth/prisma-adapter";
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

export async function registerWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res = await fetch(`${process.env.APP_BASE_URL}/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  console.log("Signup Response:", data);

  if (!res.ok) {
    return { error: data.error || "Signup failed" };
  }

  return { success: true };
}

export const saveUser = async (
  prevState: { error: boolean; success: boolean },
  payload: { formData: FormData }
) => {
  const { formData } = payload;

  const fields = Object.fromEntries(formData) as Record<
    string,
    FormDataEntryValue
  >;

  // console.log("Fields:", fields);
  // console.log({ formData, revalidatePath: revalidate, redirectTo });

  const validation = UserValidations.safeParse(fields);

  if (!validation.success) {
    return {
      error: true,
      success: false,
      errorDetails: validation.error.flatten().fieldErrors,
    };
  }

  // if (revalidate) {
  //   revalidatePath && revalidatePath(redirectTo || "/dashboard");
  // }

  try {
    await prisma.user.create({
      data: {
        email: validation.data.email as string,
        // hashedPassword: validation.data.password as string,
        hashedPassword: saltAndHashPassword(validation.data.password as string),
        role: "USER",
      },
    });
    return { error: false, success: true };
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      success: false,
      errorDetails: JSON.stringify(error),
    };
  }
  //return { error: false, success: true };
};
