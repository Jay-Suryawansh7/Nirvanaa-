import { CaseList } from '@/components/case-list';
import { CaseMetrics } from '@/components/case-metrics';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold sm:inline-block">Nyaya Readiness</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Judge Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of case readiness and prioritization for today's docket.
          </p>
        </div>
        
        <CaseMetrics />
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Case List</h2>
          <CaseList />
        </div>
      </main>
    </div>
  );
}
