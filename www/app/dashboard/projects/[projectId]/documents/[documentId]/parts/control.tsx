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
    <div>
      <Button
        variant="destructive"
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
