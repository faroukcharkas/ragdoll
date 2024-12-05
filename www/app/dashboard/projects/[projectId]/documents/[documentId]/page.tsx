import { getDocument } from "@/actions/documents";
import { DashboardHeader } from "@/components/dashboard/header/header";
import Control from "./parts/control";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

async function DocumentSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-32" />
      <Skeleton className="h-16" />
      <Skeleton className="h-64" />
    </div>
  );
}

async function RenderedDocument({
  projectId,
  documentId,
}: {
  projectId: number;
  documentId: number;
}) {
  const document = await getDocument(documentId, projectId);
  return (
    <div className="flex flex-col gap-4">
      <Control documentId={documentId} projectId={projectId} />
      <h1 className="text-2xl font-bold font-display">{document.title}</h1>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Document Body</AccordionTrigger>
          <AccordionContent>
            <p>{document.body}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ projectId: number; documentId: number }>;
}) {
  const { projectId, documentId } = await params;
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Projects", href: "/dashboard/projects" },
          { label: "Project", href: `/dashboard/projects/${projectId}` },
          {
            label: "Documents",
            href: `/dashboard/projects/${projectId}/documents`,
          },
          {
            label: "Document",
            href: `/dashboard/projects/${projectId}/documents/${documentId}`,
          },
        ]}
      />
      <div className="flex gap-4 justify-center">
        <div className="w-full max-w-2xl">
          <Suspense fallback={<DocumentSkeleton />}>
            <RenderedDocument documentId={documentId} projectId={projectId} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
