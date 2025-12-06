import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";

type CaseStatus = "ready" | "waiting" | "high-risk";

interface Case {
  id: string;
  caseNumber: string;
  parties: string;
  status: CaseStatus;
  hearingTime: string;
  readinessScore: number;
  priority: "Normal" | "High" | "Urgent";
}

const statusConfig = {
  ready: { label: "Ready", icon: CheckCircle2, color: "text-[var(--status-ready)]", bg: "bg-[var(--status-ready)]/10" },
  waiting: { label: "Waiting", icon: Clock, color: "text-[var(--status-waiting)]", bg: "bg-[var(--status-waiting)]/10" },
  "high-risk": { label: "High Risk", icon: AlertTriangle, color: "text-[var(--status-high-risk)]", bg: "bg-[var(--status-high-risk)]/10" }
};

interface DailyCaseListProps {
  onCaseSelect: (caseId: string) => void;
}

export function DailyCaseList({ onCaseSelect }: DailyCaseListProps) {
  const [activeTab, setActiveTab] = useState<CaseStatus | "all">("all");
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/cases', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch cases');

        const data = await res.json();
        
        const mappedCases: Case[] = data.map((c: any) => {
          // Map backend status to frontend status
          let status: CaseStatus = "waiting";
          if (c.status === "READY") status = "ready";
          else if (c.status === "HIGH_RISK") status = "high-risk";
          
          // Derive priority
          let priority: "Normal" | "High" | "Urgent" = "Normal";
          if (c.readinessScore < 40) priority = "Urgent";
          else if (c.readinessScore < 70) priority = "High";

          return {
            id: c.id,
            caseNumber: c.caseNumber, // Fixed field name
            parties: c.title,
            status,
            hearingTime: "09:00 AM", // Placeholder
            readinessScore: c.readinessScore,
            priority
          };
        });
        
        setCases(mappedCases);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();

    const interval = setInterval(fetchCases, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredCases = activeTab === "all" 
    ? cases 
    : cases.filter((c) => c.status === activeTab);

  const tabs: { key: CaseStatus | "all"; label: string; count: number }[] = [
    { key: "all", label: "All Cases", count: cases.length },
    { key: "ready", label: "Ready", count: cases.filter(c => c.status === "ready").length },
    { key: "waiting", label: "Waiting", count: cases.filter(c => c.status === "waiting").length },
    { key: "high-risk", label: "High Risk", count: cases.filter(c => c.status === "high-risk").length },
  ];

  if (loading) {
    return (
      <div className="w-full h-full bg-card rounded-xl border border-border/50 p-6 flex items-center justify-center shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-playfair font-semibold text-foreground">Daily Case List</h2>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-muted/50 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group",
                activeTab === tab.key
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {tab.label}
                <Badge variant="secondary" className="bg-secondary/50 text-xs px-1.5 h-5 min-w-[1.25rem] flex items-center justify-center">
                  {tab.count}
                </Badge>
              </div>
              {activeTab === tab.key && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {filteredCases.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 opacity-60">
            <Users className="w-8 h-8 opacity-50" />
            <p>No cases found for this category.</p>
          </div>
        )}

        {filteredCases.map((caseItem) => {
          const StatusIcon = statusConfig[caseItem.status].icon;
          
          return (
            <div 
              key={caseItem.id}
              onClick={() => onCaseSelect(caseItem.id)}
              className="group flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-primary/50 bg-card/40 hover:bg-card transition-all duration-300 cursor-pointer min-h-[5rem]"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Status Icon Only first, compact */}
                <div className={cn(
                  "flex-shrink-0 p-2 rounded-full",
                  statusConfig[caseItem.status].bg,
                  statusConfig[caseItem.status].color
                )}>
                   <StatusIcon className="w-5 h-5" />
                </div>

                {/* Case Identifier & Title */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">{caseItem.caseNumber}</span>
                    {caseItem.priority === "Urgent" && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}
                    {/* Status Text Badge */}
                    <span className={cn(
                      "text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded",
                      statusConfig[caseItem.status].bg,
                      statusConfig[caseItem.status].color
                    )}>
                      {statusConfig[caseItem.status].label}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground truncate pr-4 text-base">{caseItem.parties}</h3>
                </div>
              </div>

              {/* Right Side Stats */}
              <div className="flex items-center gap-6 flex-shrink-0">
                {/* Hearing */}
                <div className="hidden sm:flex flex-col items-end min-w-[80px]">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Hearing</span>
                  <div className="flex items-center gap-1.5 ">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-sm font-medium">{caseItem.hearingTime}</span>
                  </div>
                </div>

                {/* Readiness */}
                <div className="hidden md:flex flex-col items-end min-w-[100px]">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Readiness</span>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", 
                        caseItem.readinessScore >= 80 ? "bg-emerald-500" :
                        caseItem.readinessScore >= 60 ? "bg-amber-500" : "bg-rose-500"
                      )}
                      style={{ width: `${caseItem.readinessScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold mt-1 text-right w-full">{caseItem.readinessScore}%</span>
                </div>

                {/* Open Button */}
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-xs font-semibold uppercase tracking-wider">
                  Open
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
