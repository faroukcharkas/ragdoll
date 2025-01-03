import { DashboardHeader } from "@/components/dashboard/header/header";
import NewApiKeyForm from "./parts/form";

export default async function NewApiKeyPage({
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
          { label: "Project", href: `/dashboard/projects/${projectId}` },
          {
            label: "API Keys",
            href: `/dashboard/projects/${projectId}/api-keys`,
          },
          {
            label: "New",
            href: `/dashboard/projects/${projectId}/api-keys/new`,
          },
        ]}
      />
      <div className="flex justify-center">
        <div className="flex flex-col gap-8 w-full max-w-2xl">
          <NewApiKeyForm projectId={projectId} />
        </div>
      </div>
    </>
  );
}
