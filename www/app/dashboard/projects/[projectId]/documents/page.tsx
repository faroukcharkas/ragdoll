import { getDocuments } from "@/actions/documents";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DocumentCard from "./parts/document-card";
import { NewDocument } from "./parts/new-document";

function DocumentGridSkeleton() {
  return (
    <>
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
    </>
  );
}

async function DocumentGrid({ projectId }: { projectId: number }) {
  const documents = await getDocuments(projectId);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <Suspense fallback={<DocumentGridSkeleton />}>
        <NewDocument projectId={projectId} />
        {documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
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
  return <DocumentGrid projectId={projectId} />;
}
