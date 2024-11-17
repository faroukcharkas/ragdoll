export default async function DocumentPage({
  params,
}: {
  params: Promise<{ projectId: number; documentId: number }>;
}) {
  const { projectId, documentId } = await params;
  return <div>{documentId}</div>;
}
