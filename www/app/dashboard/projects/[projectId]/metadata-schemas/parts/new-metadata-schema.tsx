"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function NewMetadataSchema({
  projectId,
}: {
  projectId: number;
}) {
  return (
    <Link href={`/dashboard/projects/${projectId}/metadata-schemas/new`}>
      <Button variant="outline">
        <Plus className="w-4 h-4" />
        New Metadata Schema
      </Button>
    </Link>
  );
}
