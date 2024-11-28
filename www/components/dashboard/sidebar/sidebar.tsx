"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MainGroup } from "./parts/main-group";
import { UserMenu } from "./parts/user-menu";
import { useParams } from "next/navigation";
const data = {
  user: {
    name: "User Settings",
    email: "Manage account",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Documents",
          url: "#",
        },
        {
          title: "Metadata Schemas",
          url: "#",
        },
        {
          title: "API Keys",
          url: "#",
        },
      ],
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
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
        <MainGroup items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
