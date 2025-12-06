"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { StaffHeader } from "@/components/staff-dashboard/StaffHeader";
import { CaseFiling } from "@/components/staff-dashboard/CaseFiling";
import { DailyCaseList } from "@/components/dashboard/DailyCaseList"; // Reuse
import { Card } from "@/components/ui/card";
import { List, FileText } from "lucide-react";

export default function StaffDashboard() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30">
        <StaffHeader />

        <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
          
          {/* Left Column: Filing & Docs */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Case Filing System */}
            <div className="flex-1 min-h-[400px]">
                <CaseFiling />
            </div>

            {/* Document Management Stub */}
            <div className="h-[300px] bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-lg">Document Status</h3>
                </div>
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-lg">
                    Drag & Drop Case Files Here
                </div>
            </div>
          </div>

          {/* Right Column: Court Schedule / List */}
          <div className="lg:col-span-2 flex flex-col bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-border/50 bg-secondary/20 flex items-center gap-2">
                <List className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Court Registry List</h3>
            </div>
            <div className="flex-1 p-0 overflow-hidden">
                <DailyCaseList onCaseSelect={() => {}} />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
