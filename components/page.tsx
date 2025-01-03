export function PageHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 mb-4">{children}</div>;
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold font-display">{children}</h1>;
}

export function PageSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
