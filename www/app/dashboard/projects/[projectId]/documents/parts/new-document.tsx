import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function NewDocument({ projectId }: { projectId: number }) {
  return (
    <Link href={`/dashboard/projects/${projectId}/documents/new`}>
      <Card className="border-dashed hover:shadow-md cursor-pointer hover:bg-muted h-[300px] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <PlusIcon className="w-10 h-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">New Document</p>
        </div>
      </Card>
    </Link>
  );
}
