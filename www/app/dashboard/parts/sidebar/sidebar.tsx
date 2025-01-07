"use client";

import * as React from "react";
import { User } from "@/types/user";
import { NavProjects } from "./parts/nav-projects";
import { ProjectMap } from "@/types/projects";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ActiveProject } from "./parts/active-project";
import { UserMenu } from "./parts/user-menu";

export function DashboardSidebar({
  user,
  projectMap,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
  projectMap: ProjectMap;
}) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <Link href="/dashboard">
              <Image src={Logo} alt="Logo" width={36} height={36} />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ActiveProject projectMap={projectMap} />
        <NavProjects projects={Object.values(projectMap)} />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
