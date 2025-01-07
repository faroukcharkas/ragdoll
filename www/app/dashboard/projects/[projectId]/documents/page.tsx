import { getDocuments } from "@/actions/documents";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DocumentCard from "./parts/document-card";
import { NewDocument } from "./parts/new-document";
import { DashboardHeader } from "@/app/dashboard/parts/header";
import { PageHeader, PageTitle } from "@/components/page";

function DocumentGridSkeleton() {
  return (
    <>
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </>
  );
}

async function FetchedDocuments({ projectId }: { projectId: number }) {
  const documents = await getDocuments(projectId);
  return (
    <>
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </>
  );
}

async function DocumentGrid({ projectId }: { projectId: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <NewDocument projectId={projectId} />
      <Suspense fallback={<DocumentGridSkeleton />}>
        <FetchedDocuments projectId={projectId} />
      </Suspense>
    </div>
  );
}

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ projectId: number }>;
}) {
  const { projectId } = await params;
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Projects", href: "/dashboard/projects" },
          {
            label: "Project",
            href: `/dashboard/projects/${projectId}`,
          },
          {
            label: "Documents",
            href: `/dashboard/projects/${projectId}/documents`,
          },
        ]}
      />
      <PageHeader>
        <PageTitle>Documents</PageTitle>
      </PageHeader>
      <DocumentGrid projectId={projectId} />
    </>
  );
}
