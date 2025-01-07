import { DashboardHeader } from "@/app/dashboard/parts/header/header";
import NewMetadataSchemaForm from "./parts/form";

export default async function NewMetadataSchemaPage({
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
          {
            label: "Project",
            href: `/dashboard/projects/${projectId}`,
          },
          {
            label: "Metadata Schemas",
            href: `/dashboard/projects/${projectId}/metadata-schemas`,
          },
          {
            label: "New",
            href: `/dashboard/projects/${projectId}/metadata-schemas/new`,
          },
        ]}
      />
      <div className="flex justify-center">
        <div className="flex flex-col gap-8 w-full max-w-2xl">
          <NewMetadataSchemaForm projectId={projectId} />
        </div>
      </div>
    </>
  );
}
