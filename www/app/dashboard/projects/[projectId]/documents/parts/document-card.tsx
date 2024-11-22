import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Document } from "@/schema/documents";
import { Edit } from "lucide-react";

export default function DocumentCard({ document }: { document: Document }) {
  return (
    <Link
      href={`/dashboard/projects/${document.project_id}/documents/${document.id}`}
    >
      <Card className="hover:bg-muted hover:shadow-md cursor-pointer h-64 flex flex-col overflow-hidden">
        <CardHeader className="flex justify-between flex-row items-start gap-2">
          <p className="text-sm font-semibold font-display text-ellipsis">
            {document.title}
          </p>
          <Edit className="flex-none w-4 h-4 !m-0" />
        </CardHeader>
        <CardContent className="flex-1 text-ellipsis">
          <p className="text-xs text-muted-foreground text-ellipsis">
            {document.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
