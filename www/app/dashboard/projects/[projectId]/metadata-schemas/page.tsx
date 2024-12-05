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
import { getMetadataSchemas } from "@/actions/metadata-schemas";
import { MetadataSchema, MetadataSchemaField } from "@/schema/metadata-schemas";
import NewMetadataSchema from "./parts/new-metadata-schema";
import { PageHeader, PageTitle } from "@/components/page";
import { Frown } from "lucide-react";

function MetadataSchemaTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
    </TableRow>
  );
}

function MetadataSchemaTableSkeleton() {
  return (
    <>
      <MetadataSchemaTableRowSkeleton />
      <MetadataSchemaTableRowSkeleton />
      <MetadataSchemaTableRowSkeleton />
    </>
  );
}

function MetadataSchemaTableRow({
  metadataSchema,
}: {
  metadataSchema: MetadataSchema;
}) {
  return (
    <TableRow>
      <TableCell>{metadataSchema.name}</TableCell>
      <TableCell>
        {metadataSchema.fields.map((field: MetadataSchemaField) => (
          <div className="font-mono" key={field.name}>
            {field.name}: {field.value}
          </div>
        ))}
      </TableCell>
    </TableRow>
  );
}

async function FetchedMetadataSchemas({ projectId }: { projectId: number }) {
  const metadataSchemas: MetadataSchema[] = await getMetadataSchemas(projectId);
  return (
    <>
      {metadataSchemas.map((metadataSchema) => (
        <MetadataSchemaTableRow
          key={metadataSchema.id}
          metadataSchema={metadataSchema}
        />
      ))}
      {metadataSchemas.length === 0 && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Frown className="w-4 h-4" />
          No metadata schemas found. Create one to get started.
        </p>
      )}
    </>
  );
}

async function MetadataSchemasTable({ projectId }: { projectId: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Fields</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Suspense fallback={<MetadataSchemaTableSkeleton />}>
          <FetchedMetadataSchemas projectId={projectId} />
        </Suspense>
      </TableBody>
    </Table>
  );
}

export default async function MetadataSchemasPage({
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
            label: "Metadata Schemas",
            href: `/dashboard/projects/${projectId}/metadata-schemas`,
          },
        ]}
      />
      <PageHeader>
        <PageTitle>Metadata Schemas</PageTitle>
      </PageHeader>
      <div className="flex items-center justify-end">
        <NewMetadataSchema projectId={projectId} />
      </div>
      <MetadataSchemasTable projectId={projectId} />
    </>
  );
}
