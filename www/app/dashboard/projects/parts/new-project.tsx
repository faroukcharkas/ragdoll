import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function NewProject() {
  return (
    <Link href="/dashboard/projects/new">
      <Card className="border-dashed hover:shadow-md cursor-pointer hover:bg-muted h-32 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <Plus className="w-10 h-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">New Project</p>
        </div>
      </Card>
    </Link>
  );
}
