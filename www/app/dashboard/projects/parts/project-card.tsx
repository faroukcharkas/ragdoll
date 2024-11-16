import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/schema/projects";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="hover:bg-muted hover:shadow-md cursor-pointer">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>Click to view</CardContent>
      </Card>
    </Link>
  );
}
