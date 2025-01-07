import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/dashboard/parts/sidebar/sidebar";
import { getUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { getProjectMap } from "@/actions/projects";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, projectMap] = await Promise.all([getUser(), getProjectMap()]);

  if (!user) {
    return redirect("/login");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} projectMap={projectMap} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
