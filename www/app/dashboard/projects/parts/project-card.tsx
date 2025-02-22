import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Project } from "@/types/projects";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="hover:bg-muted hover:shadow-md cursor-pointer h-40 flex flex-col">
        <CardHeader className="flex justify-between flex-row items-center">
          <h2 className="text-xl font-semibold font-display">{project.name}</h2>
          <ChevronRight className="w-5 h-5 !m-0" />
        </CardHeader>
        <CardContent className="flex-1 flex justify-end flex-col">
          <p className="text-sm text-muted-foreground">
            Controlling Pinecone index <code>{project.index_name}</code>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
