import { DashboardHeader } from "@/components/dashboard/header/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { getApiKeys } from "@/actions/api-keys";
import { ApiKey } from "@/schema/api-keys";
import NewApiKey from "./parts/new-api-key";

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
    <>
      <ApiKeyTableRowSkeleton />
      <ApiKeyTableRowSkeleton />
      <ApiKeyTableRowSkeleton />
    </>
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
  return (
    <>
      {apiKeys.map((apiKey) => (
        <ApiKeyTableRow key={apiKey.id} apiKey={apiKey} />
      ))}
    </>
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
      <TableBody>
        <Suspense fallback={<ApiKeysTableSkeleton />}>
          <FetchedApiKeys projectId={projectId} />
        </Suspense>
      </TableBody>
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
      <div className="flex items-center justify-end">
        <NewApiKey projectId={projectId} />
      </div>
      <ApiKeysTable projectId={projectId} />
    </>
  );
}
