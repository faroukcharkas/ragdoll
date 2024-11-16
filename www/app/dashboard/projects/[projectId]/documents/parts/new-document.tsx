import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function NewDocument({ projectId }: { projectId: number }) {
  return (
    <Link href={`/dashboard/projects/${projectId}/documents/new`}>
      <Card className="border-dashed hover:shadow-md cursor-pointer hover:bg-muted">
        <CardHeader>
          <CardTitle>New Document</CardTitle>
        </CardHeader>
        <CardContent>Create</CardContent>
      </Card>
    </Link>
  );
}
