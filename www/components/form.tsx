export function FormHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function FormTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold font-display">{children}</h1>;
}

export function FormSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function FormFields({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-8">{children}</div>;
}
