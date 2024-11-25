"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function NewApiKey({ projectId }: { projectId: number }) {
  return (
    <Link href={`/dashboard/projects/${projectId}/api-keys/new`}>
      <Button variant="outline">
        <Plus className="w-4 h-4" />
        New API Key
      </Button>
    </Link>
  );
}
