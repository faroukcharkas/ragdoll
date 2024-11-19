import { getDocument } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import { Link } from "@radix-ui/react-navigation-menu";
import Control from "./parts/control";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ projectId: number; documentId: number }>;
}) {
  const { projectId, documentId } = await params;
  const document = await getDocument(documentId, projectId);
  return (
    <div>
      <Control documentId={documentId} projectId={projectId} />
      <h1 className="text-2xl font-bold">{document.title}</h1>
      <p className="text-sm text-muted-foreground">{document.description}</p>
      <p className="text-sm text-muted-foreground">{document.url}</p>
    </div>
  );
}
