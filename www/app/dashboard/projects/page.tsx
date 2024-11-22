import NewProject from "./parts/new-project";
import ProjectCard from "./parts/project-card";
import { getProjects } from "@/actions/projects";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header/header";

async function ProjectGridSkeleton() {
  return (
    <>
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </>
  );
}

async function FetchedProjects() {
  const projects = await getProjects();
  return (
    <>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </>
  );
}

async function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <NewProject />
      <Suspense fallback={<ProjectGridSkeleton />}>
        <FetchedProjects />
      </Suspense>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: "Projects", href: "/dashboard/projects" }]}
      />
      <ProjectGrid />
    </>
  );
}
