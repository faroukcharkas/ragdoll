import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Document } from "@/schema/documents";

export default function DocumentCard({ document }: { document: Document }) {
  return (
    <Link
      href={`/dashboard/projects/${document.project_id}/documents/${document.id}`}
    >
      <Card className="hover:bg-muted hover:shadow-md cursor-pointer h-[300px] flex flex-col gap-4 p-4 overflow-hidden">
        <div className="flex-1 bg-muted rounded-md shadow-inner p-4 overflow-hidden relative">
          <p className="text-xs overflow-hidden text-muted-foreground">
            {document.body}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted to-transparent"></div>
        </div>
        <div className="h-28 text-ellipsis">
          <p className="text-sm font-semibold font-display">{document.title}</p>
          <p className="text-xs text-muted-foreground">
            {document.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
