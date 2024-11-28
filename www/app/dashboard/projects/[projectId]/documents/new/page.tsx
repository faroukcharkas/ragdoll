"use server";

import { DashboardHeader } from "@/components/dashboard/header/header";
import NewDocumentForm from "./parts/form";
import { getMetadataSchemas } from "@/actions/metadata-schemas";
import { Suspense } from "react";
import { FormFields, FormHeader, FormTitle } from "@/components/form";
import { Skeleton } from "@/components/ui/skeleton";

async function FetchedForm({ projectId }: { projectId: number }) {
  const metadataSchemas = await getMetadataSchemas(projectId);
  return (
    <NewDocumentForm projectId={projectId} metadataSchemas={metadataSchemas} />
  );
}

async function FormSkeleton() {
  return (
    <>
      <FormHeader>
        <Skeleton className="w-1/2 h-10" />
        <Skeleton className="w-1/2 h-5" />
      </FormHeader>
      <FormFields>
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </FormFields>
    </>
  );
}

export default async function NewDocumentPage({
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
            label: "Documents",
            href: `/dashboard/projects/${projectId}/documents`,
          },
          {
            label: "New Document",
            href: `/dashboard/projects/${projectId}/documents/new`,
          },
        ]}
      />
      <div className="flex gap-4 justify-center">
        <FormSkeleton />
        <Suspense fallback={<FormSkeleton />}>
          <FetchedForm projectId={projectId} />
        </Suspense>
      </div>
    </>
  );
}
