import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  role: string;
}

export function AppLayout({ children, role }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role={role} />
      <div className="ml-64 w-full p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
