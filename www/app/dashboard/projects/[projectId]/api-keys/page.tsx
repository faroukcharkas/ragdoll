import { DashboardHeader } from "@/app/dashboard/parts/header/header";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { getApiKeys } from "@/actions/api-keys";
import { ApiKey } from "@/schema/api-keys";
import NewApiKey from "./parts/new-api-key";
import { PageHeader, PageTitle } from "@/components/page";
import { Frown } from "lucide-react";
function ApiKeyTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
    </TableRow>
  );
}

function ApiKeysTableSkeleton() {
  return (
    <TableBody>
      <ApiKeyTableRowSkeleton />
      <ApiKeyTableRowSkeleton />
      <ApiKeyTableRowSkeleton />
    </TableBody>
  );
}

function ApiKeyTableRow({ apiKey }: { apiKey: ApiKey }) {
  return (
    <TableRow>
      <TableCell>{apiKey.name}</TableCell>
      <TableCell>{apiKey.preview}</TableCell>
    </TableRow>
  );
}
async function FetchedApiKeys({ projectId }: { projectId: number }) {
  const apiKeys: ApiKey[] = await getApiKeys(projectId);

  if (apiKeys.length === 0) {
    return (
      <TableCaption className="text-sm text-muted-foreground flex items-center justify-center gap-2">
        <Frown className="w-4 h-4" />
        No API keys found. Create one to get started.
      </TableCaption>
    );
  }

  return (
    <TableBody>
      {apiKeys.map((apiKey) => (
        <ApiKeyTableRow key={apiKey.id} apiKey={apiKey} />
      ))}
    </TableBody>
  );
}

async function ApiKeysTable({ projectId }: { projectId: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Preview</TableHead>
        </TableRow>
      </TableHeader>
      <Suspense fallback={<ApiKeysTableSkeleton />}>
        <FetchedApiKeys projectId={projectId} />
      </Suspense>
    </Table>
  );
}

export default async function ApiKeysPage({
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
        ]}
      />
      <PageHeader>
        <PageTitle>API Keys</PageTitle>
      </PageHeader>
      <div className="flex items-center justify-end">
        <NewApiKey projectId={projectId} />
      </div>
      <ApiKeysTable projectId={projectId} />
    </>
  );
}
