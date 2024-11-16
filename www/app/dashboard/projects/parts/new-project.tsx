import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProject() {
  return (
    <Link href="/dashboard/projects/new">
      <Card className="border-dashed hover:shadow-md cursor-pointer hover:bg-muted">
        <CardHeader>
          <CardTitle>New Project</CardTitle>
        </CardHeader>
        <CardContent>Create</CardContent>
      </Card>
    </Link>
  );
}
