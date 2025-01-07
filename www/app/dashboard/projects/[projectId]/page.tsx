import { getProject } from "@/actions/projects";
import { Suspense } from "react";
import { DashboardHeader } from "@/app/dashboard/parts/header";
import { ChevronRight, FileText, Key, Shapes } from "lucide-react";
import { Database } from "lucide-react";

import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectTitle } from "./parts/project-title";

async function ProjectSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

async function ProjectNavigationGrid({ projectId }: { projectId: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link href={`/dashboard/projects/${projectId}/documents`}>
        <Card className="hover:bg-muted hover:shadow-md cursor-pointer h-40 flex flex-col">
          <CardHeader className="flex justify-between flex-row items-center">
            <CardTitle className="text-lg font-semibold font-display flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </CardTitle>
            <ChevronRight className="w-4 h-4 !m-0" />
          </CardHeader>
          <CardContent className="flex-1 flex justify-end flex-col">
            <CardDescription className="text-xs text-muted-foreground">
              Upload and manage documents for semantic search
            </CardDescription>
          </CardContent>
        </Card>
      </Link>

      <Link href={`/dashboard/projects/${projectId}/metadata-schemas`}>
        <Card className="hover:bg-muted hover:shadow-md cursor-pointer h-40 flex flex-col">
          <CardHeader className="flex justify-between flex-row items-center">
            <CardTitle className="text-lg font-semibold font-display flex items-center gap-2">
              <Shapes className="w-4 h-4" />
              Metadata Schemas
            </CardTitle>
            <ChevronRight className="w-4 h-4 !m-0" />
          </CardHeader>
          <CardContent className="flex-1 flex justify-end flex-col">
            <CardDescription className="text-xs text-muted-foreground">
              Define schemas for chunk metadata
            </CardDescription>
          </CardContent>
        </Card>
      </Link>

      <Link href={`/dashboard/projects/${projectId}/api-keys`}>
        <Card className="hover:bg-muted hover:shadow-md cursor-pointer h-40 flex flex-col">
          <CardHeader className="flex justify-between flex-row items-center">
            <CardTitle className="text-lg font-semibold font-display flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Keys
            </CardTitle>
            <ChevronRight className="w-4 h-4 !m-0" />
          </CardHeader>
          <CardContent className="flex-1 flex justify-end flex-col">
            <CardDescription className="text-xs text-muted-foreground">
              Manage API keys for your project
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

async function FetchedProject({ projectId }: { projectId: string }) {
  const project = await getProject(projectId);
  return <ProjectTitle projectId={projectId} projectName={project.name} />;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Projects", href: "/dashboard/projects" },
          { label: "Project", href: `/dashboard/projects/${projectId}` },
        ]}
      />
      <div className="flex justify-center">
        <div className="flex flex-col gap-8 w-full max-w-2xl">
          <Suspense fallback={<ProjectSkeleton />}>
            <FetchedProject projectId={projectId} />
          </Suspense>
          <ProjectNavigationGrid projectId={projectId} />
        </div>
      </div>
    </>
  );
}
