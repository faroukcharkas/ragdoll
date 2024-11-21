export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="p-6 pt-0">{children}</div>
    </>
  );
}
