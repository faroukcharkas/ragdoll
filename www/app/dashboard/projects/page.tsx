import NewProject from "./parts/new-project";
import ProjectCard from "./parts/project-card";
import { getProjects } from "@/actions/projects";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/header/header";

async function ProjectGridSkeleton() {
  return (
    <>
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
    </>
  );
}

async function ProjectGrid() {
  const projects = await getProjects();
  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: "Projects", href: "/dashboard/projects" }]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NewProject />
        <Suspense fallback={<ProjectGridSkeleton />}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Suspense>
      </div>
    </>
  );
}

export default function ProjectsPage() {
  return <ProjectGrid />;
}
