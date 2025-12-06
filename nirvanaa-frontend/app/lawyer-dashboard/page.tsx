"use client";

import { LawyerHeader } from "@/components/lawyer-dashboard/LawyerHeader";
import { MyCaseList } from "@/components/lawyer-dashboard/MyCaseList";
import { QuickActions } from "@/components/lawyer-dashboard/QuickActions";
import { ClientReadiness } from "@/components/lawyer-dashboard/ClientReadiness";
import { AuthGuard } from "@/components/auth/AuthGuard";

const LawyerDashboardPage = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden font-sans">
        <LawyerHeader />

        <main className="container mx-auto p-6 max-w-[1600px] space-y-6 pb-12">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: My Cases (Span 8) */}
            <div className="col-span-12 lg:col-span-8 h-[600px]">
               <MyCaseList />
            </div>

            {/* Right Column: Actions & Readiness (Span 4) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-[600px]">
              <div className="flex-1">
                  <QuickActions />
              </div>
              <div className="flex-1">
                  <ClientReadiness />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default LawyerDashboardPage;
