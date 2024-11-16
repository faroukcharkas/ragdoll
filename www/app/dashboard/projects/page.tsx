import NewProject from "./parts/new-project";
import ProjectCard from "./parts/project-card";
import { getProjects } from "@/actions/projects";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <NewProject />
      <Suspense fallback={<ProjectGridSkeleton />}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Suspense>
    </div>
  );
}

export default function ProjectsPage() {
  return <ProjectGrid />;
}
