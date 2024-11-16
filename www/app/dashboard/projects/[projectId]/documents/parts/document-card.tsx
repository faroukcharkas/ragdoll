import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Document } from "@/schema/documents";

export default function DocumentCard({ document }: { document: Document }) {
  return (
    <Link
      href={`/dashboard/projects/${document.project_id}/documents/${document.id}`}
    >
      <Card className="hover:bg-muted hover:shadow-md cursor-pointer">
        <CardHeader>
          <CardTitle>{document.title}</CardTitle>
        </CardHeader>
        <CardContent>{document.body.slice(0, 100)}...</CardContent>
      </Card>
    </Link>
  );
}
