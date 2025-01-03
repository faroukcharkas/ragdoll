"use client";

import { deleteDocument } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Control({
  documentId,
  projectId,
}: {
  documentId: number;
  projectId: number;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-row gap-4 justify-start mb-4">
      <Button
        variant="destructive"
        size="sm"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          deleteDocument(documentId, projectId);
        }}
      >
        {loading ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
