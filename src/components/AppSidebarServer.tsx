// ✅ No "use client" here — this is a server component
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";

export default async function AppSidebarServer(props: any) {
  const session = await auth();

  const user = session?.user
    ? {
        name: session.user.name || "No name",
        email: session.user.email || "No email",
        avatar: session.user.image || "/placeholder.png",
      }
    : {
        name: "Guest",
        email: "guest@example.com",
        avatar: "/placeholder.png",
      };

  return <AppSidebar user={user} {...props} />;
}
