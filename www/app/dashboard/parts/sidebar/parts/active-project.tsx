"use client";

import { ChevronRight, FileText, Key, Shapes } from "lucide-react";
import { useParams } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Project, ProjectMap } from "@/types/projects";

const navigationMap = [
  {
    title: "Documents",
    pre_id_url: "/dashboard/projects/",
    post_id_url: "/documents",
    icon: FileText,
  },
  {
    title: "Metadata Schemas",
    pre_id_url: "/dashboard/projects/",
    post_id_url: "/metadata-schemas",
    icon: Shapes,
  },
  {
    title: "API Keys",
    pre_id_url: "/dashboard/projects/",
    post_id_url: "/api-keys",
    icon: Key,
  },
];

export function ActiveProject({ projectMap }: { projectMap: ProjectMap }) {
  const params = useParams<{ projectId: string }>();

  if (!params.projectId) {
    return null;
  }

  const project: Project | undefined = Object.values(projectMap).find(
    (project) => project.id === Number(params.projectId)
  );

  if (!project) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{project.name}</SidebarGroupLabel>
      <SidebarMenu>
        {navigationMap.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a href={`${item.pre_id_url}${project.id}${item.post_id_url}`}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
