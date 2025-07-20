"use server";

import { PrismaClient } from "@/generated/prisma";
import { signIn, signOut } from "@/lib/auth";
import { UserValidations } from "@/lib/utils/Uservalidations";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { saltAndHashPassword } from "@/lib/utils/password";
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
/*
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

*/

// export const loginWithCredentials = async (formData: FormData) => {
//   console.log("x", formData);
//   const rawFormData = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };

//   console.log({ rawFormData });

//   try {
//     const res = await signIn("credentials", {
//       redirect: false, // 👈 IMPORTANT
//       email: rawFormData.email,
//       password: rawFormData.password,
//       role: "USER" as const,
//     });

//     console.log("from b", res);

//     if (res?.error) {
//       return { error: "Invalid email or password" };
//     } else {
//       return { success: "Login successfully" };
//     }

//     // return { success: true };
//   } catch (error: any) {
//     return {
//       error: "Something went wrong. Please try again later.",
//     };
//   }
// };

export const loginWithCredentials = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("🚀 Login attempt for:", email);

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("📋 SignIn result:", result);

    // If we reach here without throwing, authentication was successful
    return { success: "Login successful" };
  } catch (error) {
    console.error("❌ Login error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        case "CallbackRouteError":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }

    return { error: "Something went wrong. Please try again." };
  }
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
    // console.log(JSON.stringify(error));
    if (error.code === "P2002" && error?.meta?.target?.includes("email")) {
      return {
        error: true,
        success: false,
        errorDetails: "This email is already registered.", // ✅ Safe for direct display
      };
    }
    return {
      error: true,
      success: false,
      errorDetails: "Something went wrong. Please try again.",
    };
  }
  //return { error: false, success: true };
};
